import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline, Rectangle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Mic, ShieldAlert, CheckCircle, AlertTriangle, Send, Loader2, ChevronDown, ChevronUp, Info, Bell, X, Globe } from 'lucide-react'

import { UI_STRINGS } from './translations'


/* ── Vessel icon ── */
const vesselIcon = L.divIcon({
  className: '',
  html: `<div style="width:18px;height:18px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(37,99,235,0.6)"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9],
})

/* ── Map controller ── */
function MapCtrl({ center, zoom }) {
  const map = useMap()
  useEffect(() => { if (center) map.setView(center, zoom || 9, { animate: true }) }, [center, zoom, map])
  return null
}

/* ══════════════════════════════════════ */
function App() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState([9.93, 76.27])
  const [mapZoom, setMapZoom] = useState(9)

  // Data from backend
  const [conditions, setConditions] = useState(null)
  const [pfzZones, setPfzZones] = useState([])
  const [seaState, setSeaState] = useState([])
  const [userLoc, setUserLoc] = useState(null)
  const [locationLabel, setLocationLabel] = useState('Kochi Port')
  const [alerts, setAlerts] = useState([])
  const [safetyStatus, setSafetyStatus] = useState('safe')

  // Currently active data strip (updates on zone tap or query)
  const [activeConditions, setActiveConditions] = useState(null)
  const [activeSource, setActiveSource] = useState('')
  const [activeUpdated, setActiveUpdated] = useState('')

  // Query response
  const [responseData, setResponseData] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [queryMapData, setQueryMapData] = useState(null)

  // Selected PFZ zone (from tapping a marker)
  const [selectedZone, setSelectedZone] = useState(null)

  // UI toggles
  const [showAlerts, setShowAlerts] = useState(false)
  const [lang, setLang] = useState('EN')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const languages = ['EN', 'हि', 'मरा', 'த', 'മ', 'తె', 'বা']

  // Current dictionary
  const t = UI_STRINGS[lang] || UI_STRINGS['EN']

  /* ── Load initial data ── */
  useEffect(() => {
    fetch('http://localhost:8000/conditions')
      .then(r => r.json())
      .then(d => {
        setConditions(d)
        setActiveConditions({ sst: d.sst, wind_speed: d.wind_speed, wave_height: d.wave_height, chlorophyll: d.chlorophyll })
        setActiveSource(d.source || 'INCOIS')
        setActiveUpdated(d.updated || '')
        setLocationLabel(d.location || 'Kochi Port')
        setSafetyStatus(d.safety || 'safe')
        setAlerts(d.alerts || [])
        if (d.user_location) {
          setUserLoc(d.user_location)
          setMapCenter([d.user_location.lat, d.user_location.lng])
        }
      }).catch(() => {})

    fetch('http://localhost:8000/pfz-zones')
      .then(r => r.json())
      .then(d => setPfzZones(d.zones || []))
      .catch(() => {})

    fetch('http://localhost:8000/sea-state')
      .then(r => r.json())
      .then(d => setSeaState(d.grid || []))
      .catch(() => {})
  }, [])

  /* ── Zone tap handler ── */
  const handleZoneTap = (zone) => {
    setSelectedZone(zone)
    setSheetOpen(true)
    setResponseData(null)

    if (zone.conditions) {
      setActiveConditions({
        sst: zone.conditions.sst,
        wind_speed: zone.conditions.wind_speed,
        wave_height: zone.conditions.wave_height,
        chlorophyll: zone.conditions.chlorophyll,
      })
      setLocationLabel(zone.description || zone.label)
      setActiveSource(zone.source || 'INCOIS')
      setActiveUpdated(zone.updated || '')
    }
  }

  /* ── Query handler ── */
  const handleSearch = async (overrideQuery) => {
    const q = overrideQuery || query
    if (!q.trim()) return
    setIsLoading(true)
    setSheetOpen(true)
    setSelectedZone(null)
    setResponseData(null)
    setQueryMapData(null)
    
    // Convert short language code to full name for backend
    const langMap = {'EN': 'english', 'हि': 'hindi', 'मरा': 'marathi', 'த': 'tamil', 'മ': 'malayalam', 'తె': 'telugu', 'বা': 'bengali'}
    const fullLangName = langMap[lang] || 'english'

    try {
      const res = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Append language instruction so backend responds in chosen language
        body: JSON.stringify({ message: q + ` (reply in ${fullLangName})` })
      })
      const data = await res.json()
      setResponseData(data)

      if (data.map_data) {
        setQueryMapData(data.map_data)
        if (data.map_data.lat && data.map_data.lng) {
          setMapCenter([data.map_data.lat, data.map_data.lng])
          setMapZoom(10)
        } else if (data.map_data.waypoints?.[0]) {
          setMapCenter([data.map_data.waypoints[0].lat, data.map_data.waypoints[0].lng])
          setMapZoom(9)
        }
      }
      if (data.safety_status) setSafetyStatus(data.safety_status)
      else if (data.map_data?.status) setSafetyStatus(data.map_data.status)
    } catch (err) {
      console.error(err)
      setResponseData({ text: 'Network error. Cannot reach ORCA.', reasoning_trail: [] })
    } finally {
      setIsLoading(false)
      if (!overrideQuery) setQuery('')
    }
  }

  /* ── Banner ── */
  const getBanner = () => {
    switch (safetyStatus) {
      case 'danger': return { bg: 'bg-red-600', text: 'text-white', icon: <ShieldAlert size={28} />, word: t.danger }
      case 'caution': return { bg: 'bg-amber-400', text: 'text-black', icon: <AlertTriangle size={28} />, word: t.caution }
      default: return { bg: 'bg-green-600', text: 'text-white', icon: <CheckCircle size={28} />, word: t.safe }
    }
  }
  const banner = getBanner()
  const confOpacity = (c) => c === 'High' ? 0.5 : c === 'Medium' ? 0.3 : 0.15

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-50 relative font-sans">

      {/* ════ SAFETY BANNER ════ */}
      <div className={`w-full py-3 px-4 flex items-center justify-between ${banner.bg} ${banner.text} z-30 shadow-md`}>
        <div className="flex items-center gap-3">
          {banner.icon}
          <div>
            <h1 className="text-base md:text-lg font-extrabold tracking-wide uppercase leading-tight">
              {banner.word} {t.near} {locationLabel}
            </h1>
            {conditions?.craft_advisory && (
              <p className="text-xs opacity-80 font-medium">{conditions.craft_advisory}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="relative">
            <button onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 text-sm font-bold hover:bg-white/30">
              <Globe size={14} /> {lang} <ChevronDown size={12} />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 min-w-[70px]">
                {languages.map(l => (
                  <button key={l} onClick={() => { setLang(l); setShowLangMenu(false) }}
                    className={`w-full px-3 py-1.5 text-left text-sm font-bold hover:bg-gray-100 ${l === lang ? 'text-blue-600' : 'text-gray-700'}`}>{l}</button>
                ))}
              </div>
            )}
          </div>
          {/* Alert Bell */}
          {alerts.length > 0 && (
            <button onClick={() => setShowAlerts(!showAlerts)} className="relative p-1">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">{alerts.length}</span>
            </button>
          )}
        </div>
      </div>

      {/* Alert dropdown */}
      {showAlerts && (
        <div className="absolute top-14 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-gray-700">{t.activeAlerts}</p>
            <button onClick={() => setShowAlerts(false)}><X size={16} className="text-gray-400" /></button>
          </div>
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
              <span className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${a.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{a.text}</p>
                <p className="text-xs text-gray-400">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════ CONDITIONS STRIP ════ */}
      {activeConditions && (
        <div className="w-full bg-white border-b border-gray-200 px-3 py-2 z-20">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { label: t.sst, value: activeConditions.sst, color: 'text-orange-600' },
              { label: t.wind, value: activeConditions.wind_speed, color: 'text-sky-600' },
              { label: t.waves, value: activeConditions.wave_height, color: 'text-blue-600' },
              { label: t.chla, value: activeConditions.chlorophyll, color: 'text-green-600' },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg flex-shrink-0">
                <span className={`text-xs font-bold ${m.color}`}>{m.label}</span>
                <span className="font-extrabold text-gray-800 text-sm">{m.value}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-1 px-1">
            {t.near.charAt(0).toUpperCase() + t.near.slice(1)} <strong className="text-gray-600">{locationLabel}</strong> · {t.asOf} {activeUpdated} · {activeSource}
          </p>
        </div>
      )}

      {/* ════ MAP ════ */}
      <div className="flex-1 relative z-0">
        <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} className="w-full h-full" zoomControl={false}>
          <TileLayer attribution='&copy; OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapCtrl center={mapCenter} zoom={mapZoom} />

          {/* Vessel marker */}
          {userLoc && (
            <Marker position={[userLoc.lat, userLoc.lng]} icon={vesselIcon}>
              <Popup><strong>📍 {userLoc.label}</strong><br/>Your location</Popup>
            </Marker>
          )}

          {/* Sea State Heatmap */}
          {seaState.map((cell, i) => {
            const color = cell.safety === 'danger' ? '#ef4444' : cell.safety === 'caution' ? '#f59e0b' : '#3b82f6';
            return (
              <Rectangle key={`sea-${i}`} bounds={cell.bounds}
                pathOptions={{ fillColor: color, stroke: false, fillOpacity: 0.3 }}>
                <Popup>
                  <strong>{cell.label}</strong><br/>
                  SST: {cell.sst}°C<br/>
                  Waves: {cell.wave}m
                </Popup>
              </Rectangle>
            )
          })}

          {/* PFZ zone overlays */}
          {pfzZones.map((z, i) => (
            <Circle key={`pfz-${i}`} center={[z.lat, z.lng]} radius={z.radius}
              pathOptions={{ fillColor: '#22c55e', color: '#16a34a', fillOpacity: confOpacity(z.confidence), weight: 2 }}
              eventHandlers={{ click: () => handleZoneTap(z) }}
            />
          ))}

          {/* Query overlays */}
          {queryMapData?.type === 'pfz' && queryMapData.lat && (
            <Circle center={[queryMapData.lat, queryMapData.lng]}
              pathOptions={{ fillColor: '#facc15', color: '#eab308', fillOpacity: 0.6, weight: 4 }}
              radius={queryMapData.radius || 15000} />
          )}
          {queryMapData?.type === 'safety' && queryMapData.lat && (
            <Circle center={[queryMapData.lat, queryMapData.lng]}
              pathOptions={{
                fillColor: queryMapData.status === 'danger' ? '#dc2626' : queryMapData.status === 'caution' ? '#f59e0b' : '#16a34a',
                color: queryMapData.status === 'danger' ? '#dc2626' : queryMapData.status === 'caution' ? '#f59e0b' : '#16a34a',
                fillOpacity: 0.5, weight: 4
              }} radius={30000} />
          )}
          {queryMapData?.type === 'geofence' && queryMapData.bounds && (
            <Polygon positions={queryMapData.bounds}
              pathOptions={{ fillColor: '#dc2626', color: '#dc2626', fillOpacity: 0.3, weight: 3, dashArray: '10 5' }}>
              <Popup><strong>⛔ {queryMapData.name}</strong></Popup>
            </Polygon>
          )}
          {queryMapData?.type === 'route' && queryMapData.waypoints && (
            <>
              <Polyline positions={queryMapData.waypoints.map(wp => [wp.lat, wp.lng])}
                pathOptions={{ color: '#2563eb', weight: 5, dashArray: '12 6' }} />
              {queryMapData.waypoints.map((wp, i) => (
                <Marker key={i} position={[wp.lat, wp.lng]}>
                  <Popup><strong>{wp.label}</strong></Popup>
                </Marker>
              ))}
            </>
          )}
        </MapContainer>

        {/* ════ SEARCH BAR ════ */}
        <div className="absolute top-4 left-4 right-4 z-[500] flex gap-2">
          <div className="flex-1 flex items-center bg-white rounded-xl px-4 h-12 border border-gray-300 shadow-lg focus-within:border-blue-600">
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={t.placeholder}
              className="w-full bg-transparent border-none outline-none text-base text-gray-900 placeholder-gray-400 font-semibold" />
            <button onClick={() => handleSearch()} className="p-1 text-blue-600 active:scale-90"><Send size={22} /></button>
          </div>
          <button onClick={() => {}} className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg active:bg-blue-700 active:scale-95 flex-shrink-0">
            <Mic size={24} />
          </button>
        </div>

        {/* ════ BOTTOM SHEET ════ */}
        <div className={`absolute bottom-0 left-0 right-0 z-[500] transition-transform duration-300 ease-out ${sheetOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'}`}>
          <button onClick={() => setSheetOpen(!sheetOpen)}
            className="w-full flex justify-center pt-2 pb-1 bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.12)] border-t border-gray-200">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
          </button>

          <div className="bg-white px-5 pb-6 max-h-[55vh] overflow-y-auto">
            {/* Loading */}
            {isLoading && (
              <div className="flex items-center gap-3 text-blue-600 py-4">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-lg font-bold">{t.analyzing}</span>
              </div>
            )}

            {/* Zone evidence panel */}
            {!isLoading && selectedZone && !responseData && (
              <div className="py-3 space-y-3">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">PFZ — {selectedZone.description}</h3>
                  <p className="text-base font-semibold text-gray-700 mt-1">{t.likelyCatch}: <span className="text-green-700">{selectedZone.species}</span></p>
                </div>

                {selectedZone.conditions && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1">
                    <p className="text-sm font-bold text-gray-700">
                      {t.why}: <span className="font-normal">{t.sst} {selectedZone.conditions.sst} ({selectedZone.conditions.sst_range}) · {t.chla} {selectedZone.conditions.chlorophyll}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.conditions}: {t.wind} {selectedZone.conditions.wind_speed}, {t.waves} {selectedZone.conditions.wave_height} — <span className="font-semibold text-green-700">{selectedZone.conditions.craft_advisory}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{selectedZone.source}, {t.asOf} {selectedZone.updated}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${selectedZone.confidence === 'High' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-amber-100 text-amber-700 border border-amber-300'}`}>
                    {t.confidence}: {selectedZone.confidence}
                  </span>
                </div>
              </div>
            )}

            {/* Query response */}
            {!isLoading && responseData && (
              <div className="py-3 space-y-3">
                <p className="text-lg font-semibold text-gray-800 leading-relaxed">{responseData.text}</p>

                {/* Evidence chips */}
                {activeConditions && (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">{t.sst} {activeConditions.sst}</span>
                    <span className="px-2 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-bold text-green-700">{t.chla} {activeConditions.chlorophyll}</span>
                    <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-bold text-gray-500">{t.asOf} {activeUpdated} · {activeSource}</span>
                  </div>
                )}

                {/* Reasoning trail */}
                {responseData.reasoning_trail?.length > 0 && (
                  <details className="group">
                    <summary className="flex items-center gap-1.5 text-sm font-bold text-blue-600 cursor-pointer select-none py-1">
                      <Info size={14} /> {t.howItKnows}
                      <ChevronDown size={14} className="group-open:hidden" />
                      <ChevronUp size={14} className="hidden group-open:block" />
                    </summary>
                    <div className="mt-2 space-y-1.5 pl-1">
                      {responseData.reasoning_trail.map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${step.status === 'done' ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                          <p className="text-xs text-gray-600"><span className="font-bold text-gray-800">{step.agent}</span> — {step.result || step.action}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )}

            {/* Default collapsed text */}
            {!isLoading && !responseData && !selectedZone && (
              <p className="text-sm text-gray-400 py-3 text-center">{t.defaultText}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App