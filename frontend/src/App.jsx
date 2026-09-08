import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'

import { UI_STRINGS, LANG_CODES, LANG_FULL } from './translations'
import { getConditions, getPfzZones, getSeaState, sendQuery } from './api/client'
import { deriveInsights } from './lib/insights'
import { isNum } from './lib/format'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useReducedMotion } from './hooks/useReducedMotion'

import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'
import Header from './components/Header'
import SafetyBanner from './components/SafetyBanner'
import ConditionsStrip from './components/ConditionsStrip'
import OceanMap from './components/OceanMap'
import AskOrca from './components/AskOrca'
import OrcaResponse from './components/OrcaResponse'
import AIInsights from './components/AIInsights'
import AlertsPanel from './components/AlertsPanel'
import ZoneDetails from './components/ZoneDetails'
import BottomSheet from './components/BottomSheet'
import ReportPanel from './components/ReportPanel'
import SettingsPanel from './components/SettingsPanel'
import Login from './components/Login'
import { useAuth } from './contexts/AuthContext'

const DEFAULT_CENTER = [15, 76] // Arabian Sea overview
const LANG_KEY = 'orca.lang'

/** Centre point for a map_data overlay, guarding every optional field. */
function overlayCenter(md) {
  if (!md || typeof md !== 'object') return null
  if (Array.isArray(md.waypoints)) {
    const wps = md.waypoints.filter((p) => p && isNum(p.lat) && isNum(p.lng))
    if (wps.length) {
      const mid = wps[Math.floor(wps.length / 2)] // keep the line clear of the drawer
      return [mid.lat, mid.lng]
    }
  }
  if (isNum(md.lat) && isNum(md.lng)) return [md.lat, md.lng]
  if (Array.isArray(md.bounds)) {
    const pts = md.bounds.filter((p) => Array.isArray(p) && isNum(p[0]) && isNum(p[1]))
    if (pts.length) {
      const lat = pts.reduce((s, p) => s + p[0], 0) / pts.length
      const lng = pts.reduce((s, p) => s + p[1], 0) / pts.length
      return [lat, lng]
    }
  }
  return null
}

export default function App() {
  /* ── Language ── */
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY)
      if (saved && LANG_CODES.includes(saved)) return saved
    } catch {
      /* ignore */
    }
    return 'EN'
  })
  const t = useMemo(() => ({ ...UI_STRINGS.EN, ...(UI_STRINGS[lang] || {}) }), [lang])
  const changeLang = useCallback((code) => {
    setLang(code)
    try {
      localStorage.setItem(LANG_KEY, code)
    } catch {
      /* ignore */
    }
  }, [])

  /* ── Environment ── */
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const reducedMotion = useReducedMotion()

  /* ── Auth ── */
  const { currentUser } = useAuth()

  /* ── Dashboard data ── */
  const [conditions, setConditions] = useState(null)
  const [pfzZones, setPfzZones] = useState([])
  const [seaState, setSeaState] = useState([])
  const [dashLoading, setDashLoading] = useState(true)
  const [systemStatus, setSystemStatus] = useState('connecting') // connecting | live | offline

  /* ── Map view ── */
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(6)
  const [readout, setReadout] = useState(DEFAULT_CENTER)
  const [showPfz, setShowPfz] = useState(true)
  const [showSeaState, setShowSeaState] = useState(true)
  const didInitCenter = useRef(false)

  // Apply the results of the three dashboard GETs. Also recentre the chart on
  // the vessel once, the first time /conditions arrives.
  const applyResults = useCallback(([c, p, s]) => {
    let ok = false
    if (c.status === 'fulfilled') {
      setConditions(c.value)
      ok = true
      const u = c.value?.user_location
      if (!didInitCenter.current && u && isNum(u.lat) && isNum(u.lng)) {
        didInitCenter.current = true
        setCenter([u.lat, u.lng])
        setZoom(9)
      }
    }
    if (p.status === 'fulfilled') {
      setPfzZones(Array.isArray(p.value?.zones) ? p.value.zones : [])
      ok = true
    }
    if (s.status === 'fulfilled') {
      setSeaState(Array.isArray(s.value?.grid) ? s.value.grid : [])
      ok = true
    }
    setSystemStatus(ok ? 'live' : 'offline')
    setDashLoading(false)
  }, [])

  const loadData = useCallback(async () => {
    setDashLoading(true)
    setSystemStatus('connecting')
    applyResults(await Promise.allSettled([getConditions(), getPfzZones(), getSeaState()]))
  }, [applyResults])

  useEffect(() => {
    let alive = true
    Promise.allSettled([getConditions(), getPfzZones(), getSeaState()]).then((res) => {
      if (alive) applyResults(res)
    })
    return () => {
      alive = false
    }
  }, [applyResults])

  const handleMove = useCallback((lat, lng) => setReadout([lat, lng]), [])

  /* ── Query / interaction state ── */
  const [qLoading, setQLoading] = useState(false)
  const [qError, setQError] = useState(null) // 'timeout' | 'failed' | null
  const [response, setResponse] = useState(null)
  const [queryMapData, setQueryMapData] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)

  /* ── UI shell state ── */
  const [activeNav, setActiveNav] = useState('home')
  const [mobileSheet, setMobileSheet] = useState(null) // response | zone | conditions | insights | alerts
  const [modal, setModal] = useState(null) // reports | settings
  const askInputRef = useRef(null)

  /* ── Derived ── */
  const alerts = conditions?.alerts || []
  const userLoc = conditions?.user_location || null

  const safetyStatus = useMemo(() => {
    if (response?.safety_status) return response.safety_status
    if (response?.map_data?.status) return response.map_data.status
    if (selectedZone?.conditions?.safety) return selectedZone.conditions.safety
    if (conditions?.safety) return conditions.safety
    return dashLoading ? 'unknown' : 'safe'
  }, [response, selectedZone, conditions, dashLoading])

  const locationLabel = selectedZone?.description || conditions?.location || null

  const activeConditions = useMemo(() => {
    if (selectedZone?.conditions) return selectedZone.conditions
    if (!conditions) return null
    return {
      sst: conditions.sst,
      wind_speed: conditions.wind_speed,
      wave_height: conditions.wave_height,
      chlorophyll: conditions.chlorophyll,
    }
  }, [selectedZone, conditions])
  const activeSource = selectedZone?.source || conditions?.source || ''
  const activeUpdated = selectedZone?.updated || conditions?.updated || ''

  const insights = useMemo(
    () => deriveInsights({ conditions, pfzZones, safetyStatus, t }),
    [conditions, pfzZones, safetyStatus, t],
  )

  /* ── Handlers ── */
  const runQuery = useCallback(
    async (raw) => {
      const q = String(raw ?? '').trim()
      if (!q) return
      setSelectedZone(null)
      setQError(null)
      setResponse(null)
      setQueryMapData(null)
      setQLoading(true)
      setActiveNav('ask')
      if (isMobile) setMobileSheet('response')

      const full = LANG_FULL[lang] || 'english'
      try {
        const data =await sendQuery(message, {
  onToken: (token) => setAnswer((prev) => prev + token),
  onDone: (final) => setMapData(final.map_data),
})
        setResponse(data)
        const md = data?.map_data || null
        setQueryMapData(md)
        const c = overlayCenter(md)
        if (c) {
          setCenter(c)
          setZoom(md?.type === 'route' ? 8 : 10)
        }
      } catch (err) {
        setQError(err?.name === 'AbortError' ? 'timeout' : 'failed')
      } finally {
        setQLoading(false)
      }
    },
    [isMobile, lang],
  )

  const lastQueryRef = useRef('')
  const handleSubmit = useCallback(
    (text) => {
      lastQueryRef.current = text
      runQuery(text)
    },
    [runQuery],
  )
  const retryQuery = useCallback(() => {
    if (lastQueryRef.current) runQuery(lastQueryRef.current)
  }, [runQuery])

  const handleZoneTap = useCallback(
    (zone) => {
      setSelectedZone(zone)
      setResponse(null)
      setQError(null)
      setQueryMapData(null)
      if (isNum(zone?.lat) && isNum(zone?.lng)) {
        setCenter([zone.lat, zone.lng])
        setZoom(9)
      }
      if (isMobile) setMobileSheet('zone')
    },
    [isMobile],
  )

  const handleInsightAction = useCallback(
    (action) => {
      if (!action) return
      if (action.type === 'map' && Array.isArray(action.center) && isNum(action.center[0]) && isNum(action.center[1])) {
        setCenter(action.center)
        setZoom(action.zoom || 9)
        setActiveNav('map')
        setMobileSheet(null)
      } else if (action.type === 'ask' && action.query) {
        handleSubmit(action.query)
      }
    },
    [handleSubmit],
  )

  const handleCenter = useCallback((c, z) => {
    if (Array.isArray(c) && isNum(c[0]) && isNum(c[1])) {
      setCenter(c)
      setZoom(z || 10)
      setMobileSheet(null)
    }
  }, [])

  const handleNav = useCallback(
    (id) => {
      if (id === 'reports') {
        setModal('reports')
        setActiveNav('reports')
        return
      }
      if (id === 'settings' || id === 'more') {
        setModal('settings')
        setActiveNav('settings')
        return
      }
      setActiveNav(id)
      if (id === 'alerts') {
        setMobileSheet(isMobile ? 'alerts' : null)
      } else if (id === 'ask') {
        setMobileSheet(null)
        setTimeout(() => askInputRef.current?.focus(), 0)
      } else {
        setMobileSheet(null)
      }
    },
    [isMobile],
  )

  const closeModal = useCallback(() => {
    setModal(null)
    setActiveNav((a) => (a === 'reports' || a === 'settings' ? 'home' : a))
  }, [])

  const clearDrawer = useCallback(() => {
    setResponse(null)
    setSelectedZone(null)
    setQError(null)
    setQueryMapData(null)
  }, [])

  /* ── Drawer content (shared desktop drawer + mobile sheet) ── */
  const drawerActive = qLoading || qError || response || selectedZone
  const drawerContent =
    qLoading || qError || response ? (
      <OrcaResponse
        loading={qLoading}
        error={qError}
        data={response}
        activeConditions={activeConditions}
        activeSource={activeSource}
        activeUpdated={activeUpdated}
        safetyStatus={response ? safetyStatus : null}
        onRetry={retryQuery}
        t={t}
      />
    ) : selectedZone ? (
      <ZoneDetails zone={selectedZone} onAsk={handleSubmit} onCenter={handleCenter} t={t} />
    ) : null

  const sheetTitle =
    mobileSheet === 'response'
      ? t.orcaAnswer
      : mobileSheet === 'zone'
        ? t.legendPfz
        : mobileSheet === 'conditions'
          ? t.conditionsTitle
          : mobileSheet === 'insights'
            ? t.insightsTitle
            : mobileSheet === 'alerts'
              ? t.alertsTitle
              : ''

  const mapFocus = activeNav === 'map'

  if (!currentUser) {
    return <Login />
  }

  return (
    <div className="orca-bg relative flex h-[100dvh] w-full overflow-hidden bg-ocean-900 font-sans text-ink">
      <Sidebar
        activeNav={activeNav}
        onNav={handleNav}
        systemStatus={systemStatus}
        alertCount={alerts.length}
        t={t}
      />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Header
          t={t}
          lang={lang}
          onLang={changeLang}
          alertCount={alerts.length}
          onBell={() => handleNav('alerts')}
          onSearch={(v) => handleSubmit(`Ocean conditions and safety near ${v}`)}
          homePort={conditions?.location}
          systemStatus={systemStatus}
        />

        <SafetyBanner
          status={safetyStatus}
          locationLabel={locationLabel}
          advisory={conditions?.craft_advisory}
          updated={conditions?.updated}
          loading={dashLoading && !conditions}
          t={t}
        />

        {systemStatus === 'offline' && (
          <div
            role="alert"
            className="flex items-center gap-3 border-b border-status-danger/30 bg-status-danger/10 px-4 py-2 text-sm lg:px-6"
          >
            <WifiOff size={16} className="shrink-0 text-status-danger" />
            <span className="font-semibold text-ink">{t.backendDown}</span>
            <span className="hidden text-ink-dim sm:inline">— {t.backendDownMsg}</span>
            <button
              type="button"
              onClick={loadData}
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline px-2.5 py-1 text-xs font-semibold text-accent transition-colors hover:bg-black/5"
            >
              <RefreshCw size={12} />
              {t.retry}
            </button>
          </div>
        )}

        <div id="main" className="flex min-h-0 flex-1">
          {/* ── Map area ── */}
          <main className="relative min-h-0 flex-1">
            <OceanMap
              center={center}
              zoom={zoom}
              userLoc={userLoc}
              pfzZones={pfzZones}
              seaState={seaState}
              showPfz={showPfz}
              showSeaState={showSeaState}
              queryMapData={queryMapData}
              onZoneTap={handleZoneTap}
              onMove={handleMove}
              t={t}
            />

            {/* Layer toggles */}
            <div className="absolute left-3 top-3 z-[500] rounded-xl border border-hairline bg-ocean-850/90 p-1 backdrop-blur">
              <LayerToggle
                active={showPfz}
                onClick={() => setShowPfz((v) => !v)}
                dot="#2EE6A6"
                label={t.layerPfz}
              />
              <LayerToggle
                active={showSeaState}
                onClick={() => setShowSeaState((v) => !v)}
                dot="#22B8FF"
                label={t.layerSea}
              />
            </div>

            {/* Coordinate readout */}
            <div className="absolute bottom-3 right-3 z-[500] hidden rounded-lg border border-hairline bg-ocean-850/90 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-dim backdrop-blur sm:block">
              <div className="text-ink">{fmtReadout(readout)}</div>
            </div>

            {/* Command console + response drawer */}
            <div className="absolute inset-x-2 bottom-[74px] z-[600] flex flex-col gap-2 sm:inset-x-3 lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[min(640px,52vw)]">
              {drawerActive && (
                <div className="hidden max-h-[46vh] animate-fade-up overflow-y-auto rounded-2xl border border-hairline-strong bg-ocean-850/95 p-4 shadow-inst backdrop-blur lg:block">
                  <div className="mb-2 flex justify-end">
                    <button
                      type="button"
                      onClick={clearDrawer}
                      disabled={qLoading}
                      className="rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-dim hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t.clear}
                    </button>
                  </div>
                  {drawerContent}
                </div>
              )}
              <AskOrca
                ref={askInputRef}
                onSubmit={handleSubmit}
                loading={qLoading}
                lang={lang}
                t={t}
              />
            </div>
          </main>

          {/* ── Right intelligence column ── */}
          <aside
            className={
              mapFocus
                ? 'hidden'
                : 'hidden w-[360px] shrink-0 flex-col overflow-y-auto border-l border-hairline bg-ocean-850/60 lg:flex'
            }
          >
            <AIInsights
              insights={insights}
              loading={dashLoading && !conditions}
              onAction={handleInsightAction}
              t={t}
            />
            <ConditionsStrip
              conditions={conditions}
              safetyStatus={safetyStatus}
              loading={dashLoading && !conditions}
              t={t}
            />
            <AlertsPanel alerts={alerts} loading={dashLoading && !conditions} t={t} />
          </aside>
        </div>
      </div>

      {/* ── Mobile navigation + sheet ── */}
      <MobileNav
        activeNav={activeNav}
        onNav={handleNav}
        alertCount={alerts.length}
        t={t}
      />

      <BottomSheet
        open={!!mobileSheet}
        title={sheetTitle}
        closeLabel={t.close}
        onClose={() => setMobileSheet(null)}
      >
        {mobileSheet === 'response' || mobileSheet === 'zone' ? drawerContent : null}
        {mobileSheet === 'conditions' && (
          <ConditionsStrip
            conditions={conditions}
            safetyStatus={safetyStatus}
            loading={dashLoading && !conditions}
            t={t}
            className="border-0 p-0"
          />
        )}
        {mobileSheet === 'insights' && (
          <AIInsights
            insights={insights}
            loading={dashLoading && !conditions}
            onAction={handleInsightAction}
            t={t}
            className="border-0 p-0"
          />
        )}
        {mobileSheet === 'alerts' && (
          <AlertsPanel alerts={alerts} loading={dashLoading && !conditions} t={t} className="p-0" />
        )}
      </BottomSheet>

      {modal === 'reports' && (
        <ReportPanel
          conditions={conditions}
          pfzZones={pfzZones}
          safetyStatus={safetyStatus}
          t={t}
          onClose={closeModal}
        />
      )}
      {modal === 'settings' && (
        <SettingsPanel
          lang={lang}
          onLang={changeLang}
          systemStatus={systemStatus}
          reducedMotion={reducedMotion}
          onRetry={loadData}
          t={t}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

/* ── Small local pieces ── */

function LayerToggle({ active, onClick, dot, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ' +
        (active ? 'text-ink' : 'text-ink-dim hover:text-ink')
      }
    >
      <span
        className="h-2.5 w-2.5 rounded-full border transition-opacity"
        style={{
          background: active ? dot : 'transparent',
          borderColor: dot,
          opacity: active ? 1 : 0.5,
        }}
      />
      {label}
    </button>
  )
}

function fmtReadout([lat, lng]) {
  if (!isNum(lat) || !isNum(lng)) return '-- --'
  const p = (x, a, b) => `${Math.abs(x).toFixed(3)}° ${x >= 0 ? a : b}`
  return `${p(lat, 'N', 'S')}  ${p(lng, 'E', 'W')}`
}
