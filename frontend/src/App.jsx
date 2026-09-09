import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'

import { UI_STRINGS, LANG_CODES, LANG_FULL } from './translations'
import { getConditions, getPfzZones, getSeaState, sendQuery } from './api/client'
import { deriveInsights } from './lib/insights'
import { isNum } from './lib/format'
import { NAV_ITEMS } from './lib/nav'
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
import MapLayers from './components/MapLayers'
import ReportPanel from './components/ReportPanel'
import SettingsPanel from './components/SettingsPanel'
import Login from './components/Login'
import { useAuth } from './contexts/AuthContext'
import InvestigationView from './components/visualizer/InvestigationView'
import { useInvestigation } from './components/visualizer/useInvestigation'

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
  const investigation = useInvestigation()

  /* ── UI shell state ── */
  const [activeNav, setActiveNav] = useState('home') // 'home' | 'map' — the only persistent views
  const [mobileSheet, setMobileSheet] = useState(null) // response | zone | conditions | insights | alerts | more
  const [modal, setModal] = useState(null) // reports | settings
  const askInputRef = useRef(null)
  const alertsRef = useRef(null)
  const pulseTimer = useRef(null)
  const [alertsPulse, setAlertsPulse] = useState(false)
  useEffect(() => () => window.clearTimeout(pulseTimer.current), [])

  const clearDrawer = useCallback(() => {
    setResponse(null)
    setSelectedZone(null)
    setQError(null)
    setQueryMapData(null)
  }, [])

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
      if (isMobile) setMobileSheet('response')
      investigation.start(q)

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
    [isMobile, lang, investigation],
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

  // Desktop "Alerts": the panel is always mounted in the right column, so this
  // reveals it in place (scroll + brief pulse) rather than opening a fake page.
  const flashAlerts = useCallback(() => {
    setActiveNav('home') // make sure the right column is visible (not map-focus)
    setModal(null)
    setAlertsPulse(true)
    window.clearTimeout(pulseTimer.current)
    pulseTimer.current = window.setTimeout(() => setAlertsPulse(false), 1600)
    requestAnimationFrame(() =>
      alertsRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: reducedMotion ? 'auto' : 'smooth',
      }),
    )
  }, [reducedMotion])

  const handleNav = useCallback(
    (id) => {
      switch (id) {
        case 'home': // reset to the default dashboard
          setActiveNav('home')
          setModal(null)
          setMobileSheet(null)
          clearDrawer()
          break
        case 'map': // real toggle — fill the map / restore the dashboard
          setModal(null)
          setMobileSheet(null)
          setActiveNav((v) => (v === 'map' ? 'home' : 'map'))
          break
        case 'alerts':
          if (isMobile) {
            setModal(null)
            setMobileSheet('alerts')
          } else {
            flashAlerts()
          }
          break
        case 'reports':
          setMobileSheet(null)
          setModal('reports')
          break
        case 'settings':
          setMobileSheet(null)
          setModal('settings')
          break
        case 'more': // mobile: sheet listing the 'more'-slot nav items
          setModal(null)
          setMobileSheet('more')
          break
        default:
          break
      }
    },
    [isMobile, clearDrawer, flashAlerts],
  )

  const closeModal = useCallback(() => setModal(null), [])

  /* ── Drawer content (shared desktop drawer + mobile sheet) ── */
  const drawerActive = qLoading || qError || response || selectedZone
  const drawerContent =
    qError || response ? (
      <OrcaResponse
        loading={false}
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
    {
      response: t.orcaAnswer,
      zone: t.legendPfz,
      conditions: t.conditionsTitle,
      insights: t.insightsTitle,
      alerts: t.alertsTitle,
      more: t.navMore,
    }[mobileSheet] || ''

  const mapFocus = activeNav === 'map'
  const navState = { view: activeNav, modal, mapFocus, mobileSheet }

  if (!currentUser) {
    return <Login />
  }

  return (
    <div className="orca-bg relative flex h-[100dvh] w-full overflow-hidden bg-ocean-900 font-sans text-ink">
      <Sidebar
        navState={navState}
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
            className="flex items-center gap-3 border-b border-status-danger/30 bg-status-danger/10 px-4 py-2 text-body lg:px-6"
          >
            <WifiOff size={16} className="shrink-0 text-status-danger" />
            <span className="font-semibold text-ink">{t.backendDown}.</span>
            <span className="hidden text-ink-dim sm:inline">{t.backendDownMsg}</span>
            <button
              type="button"
              onClick={loadData}
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-hairline px-2.5 py-1 text-label text-accent transition-colors hover:bg-black/5"
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

            {qLoading && (
              <div className="absolute inset-0 z-[400] pointer-events-none">
                <InvestigationView investigation={investigation} />
              </div>
            )}

            {/* Chart layers + legend */}
            <div className="absolute left-3 top-3 z-[500]">
              <MapLayers
                showPfz={showPfz}
                showSeaState={showSeaState}
                onTogglePfz={() => setShowPfz((v) => !v)}
                onToggleSeaState={() => setShowSeaState((v) => !v)}
                activeOverlay={queryMapData?.type}
                t={t}
              />
            </div>

            {/* Coordinate readout */}
            <div className="absolute bottom-3 right-3 z-[500] hidden rounded-xl border border-hairline bg-ocean-850/90 px-2.5 py-1.5 font-mono text-meta text-ink-dim backdrop-blur sm:block">
              <div className="text-ink">{fmtReadout(readout)}</div>
            </div>

            {/* Command console + response drawer. On mobile it sits clear above
                the bottom nav (bar height + safe-area inset). */}
            <div className="absolute inset-x-2 bottom-[calc(72px+env(safe-area-inset-bottom,0px))] z-[600] flex flex-col gap-2 sm:inset-x-3 lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[min(640px,52vw)]">
              {drawerActive && !qLoading && drawerContent && (
                <div className="hidden max-h-[46vh] animate-fade-up overflow-y-auto rounded-xl border border-hairline-strong bg-ocean-850/95 p-block shadow-inst backdrop-blur lg:block">
                  <div className="mb-2 flex justify-end">
                    <button
                      type="button"
                      onClick={clearDrawer}
                      disabled={qLoading}
                      className="rounded-xl px-2 py-0.5 text-label text-ink-dim hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
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
            {/* Alerts read as a recessed tray — exceptions, not steady readouts. */}
            <div ref={alertsRef} className="mt-auto bg-surface-2/70">
              <AlertsPanel
                alerts={alerts}
                loading={dashLoading && !conditions}
                pulse={alertsPulse}
                t={t}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile navigation + sheet ── */}
      <MobileNav
        navState={navState}
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
            hideHeader
          />
        )}
        {mobileSheet === 'insights' && (
          <AIInsights
            insights={insights}
            loading={dashLoading && !conditions}
            onAction={handleInsightAction}
            t={t}
            className="border-0 p-0"
            hideHeader
          />
        )}
        {mobileSheet === 'alerts' && (
          <AlertsPanel
            alerts={alerts}
            loading={dashLoading && !conditions}
            t={t}
            className="p-0"
            hideHeader
          />
        )}
        {mobileSheet === 'more' && <MoreSheet onNav={handleNav} t={t} />}
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

/** Contents of the mobile "More" sheet — the nav items that don't fit the bar. */
function MoreSheet({ onNav, t }) {
  return (
    <ul className="space-y-stack">
      {NAV_ITEMS.filter((i) => i.slot === 'more').map((item) => {
        const Icon = item.icon
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onNav(item.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-hairline bg-surface-1/40 px-3 py-3 text-left text-body font-semibold text-ink transition-colors hover:bg-black/5"
            >
              <Icon size={18} className="text-ink-dim" />
              {t[item.labelKey]}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function fmtReadout([lat, lng]) {
  if (!isNum(lat) || !isNum(lng)) return '-- --'
  const p = (x, a, b) => `${Math.abs(x).toFixed(3)}° ${x >= 0 ? a : b}`
  return `${p(lat, 'N', 'S')}  ${p(lng, 'E', 'W')}`
}
