import { useEffect, useRef, useState } from 'react'
import { Ship, Fish, TriangleAlert, Plus, Minus, LocateFixed } from 'lucide-react'
import './OceanMap.css'

/* Projection: lon 30E..115E -> x 0..100  ·  lat 30N..20S -> y 0..100 */

const P = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ') + ' Z'

const AFRICA = [
  [0,0],[4.4,0],[4.6,4],[5.6,7],[6.8,11],[8.2,16],[8.8,22],[10.9,28],[13.9,33],
  [15.3,36.8],[17.5,39],[19,38],[21,37],[23.4,36.6],[25.1,36.4],[23.5,45],[22,49],
  [20,52],[18.1,56],[16.5,58],[14.5,61],[12.8,65],[11.4,68],[11,74],[10.9,76],
  [10.9,82],[11.4,88],[10.6,94],[0,100],
]
const EURASIA = [
  [5.6,0],[6.5,4],[8.2,10],[10.6,16],[11.8,22],[14.1,28],[15.9,33],[17.6,34.4],
  [21.2,32],[24.7,30],[28.2,26],[30.6,21],[33.6,12.8],[30.9,7.2],[34.5,8],[38,9.8],
  [41.5,10],[43.5,10.4],[46.1,12],[46.8,14],[48,16],[48.6,19.5],[50.35,22],
  [50.8,24],[50.9,26],[51.5,29],[52.7,33],[54.5,38],[55.9,43.8],[57.2,44.6],
  [59.2,34],[61.5,26],[64.1,21],[66.6,19.4],[69.4,16.4],[72.1,15.2],[72.7,15.4],
  [74.1,20],[75.6,28],[78.8,32],[80.4,40],[80.4,44],[81.5,47],[82,49],[84.35,54],
  [86.8,57.4],[85.5,51],[85,47],[85,43],[84.5,39],[84,36],[83.2,33],[85,31],
  [87,28],[89,24],[91.5,20],[94.1,14],[94.1,0],
]
const SUMATRA = [
  [76.8,49],[78.6,52],[80.2,55.5],[81.6,59.5],[83,63.5],[85,67.5],[88.8,72],
  [86.6,70],[84.6,66.3],[83.2,62.3],[82.2,58.8],[81.4,55.5],[79.8,52.3],[78.2,50.3],
]
const JAVA = [
  [88.8,73.2],[92.5,74],[96,74.8],[98.6,75.4],[98.4,77.5],[94,77],[90,76.5],[88.3,75.8],
]
const SRI_LANKA = [
  [59.2,41.6],[60.5,40.9],[61.4,42.4],[61.6,44.6],[61,47],[59.6,47.4],[58.7,45.2],[58.8,43],
]
const ISLETS = {
  lakshadweep: [[50.7,39.3],[50.2,40.6],[50.9,41.8]],
  maldives: [[50.8,46.2],[50.6,48.8],[50.5,51.4],[50.7,54],[50.9,56.6],[51.1,59.2]],
  andaman: [[74.2,34.6],[74.3,36.8],[74.5,39.2],[74.9,45.2],[75.1,47.2]],
}

const GRID_V = [40,50,60,70,80,90,100].map((lon) => ({ lon, x: (lon-30)/85*100 }))
const GRID_H = [20,10,0,-10].map((lat) => ({ lat, y: (30-lat)/50*100 }))

const CURRENTS = [
  'M19 58 C 26 50, 33 42, 40 33',
  'M48 55 C 45 48, 40 42, 34 36',
  'M64 46 C 66 40, 70 36, 76 33',
  'M30 90 C 45 84, 60 82, 78 84',
]
const SST_WARM = [
  { x: 43, y: 37, rx: 15, ry: 12 },
  { x: 56, y: 53, rx: 10, ry: 8 },
  { x: 67, y: 45, rx: 9, ry: 7 },
]
const SST_COOL = [
  { x: 20.5, y: 47.5, rx: 12, ry: 10 },
  { x: 76.5, y: 51, rx: 9, ry: 7 },
]
const CHL_PLUMES = [
  { pts: [[45,23],[48.5,24.5],[48,28],[45,27.5]] },
  { pts: [[64,18.5],[67.5,18],[67,20.5],[64.5,20.5]] },
]
const FISHING_ZONES = [
  { id: 'FZ-07', x: 45.5, y: 30.5, pts: [[43.5,27.5],[47,26],[47.5,30],[44,31.5]] },
  { id: 'FZ-03', x: 58.6, y: 47.8, pts: [[57.2,45.5],[59.5,44.8],[59.8,47.3],[57.4,48]] },
  { id: 'FZ-11', x: 64.3, y: 20.2, pts: [[62,17.5],[65,16.5],[65.8,19.5],[63,20.5]] },
]
const TRACKS = [
  { tag: 'R-01', cls: 'route-main', pts: [[34.5,15],[38.5,19.5],[42.5,23],[46,24.8],[49,24.3],[50,23]] },
  { tag: 'R-02', cls: 'route-alt', pts: [[60.5,49],[65.5,54],[71,58],[77,60],[82,62.5]] },
  { tag: 'R-03', cls: 'route-alt', pts: [[80,52],[76.5,49.5],[72.5,46],[68.5,41.5],[64.5,37.5],[61,34]] },
]
const VESSELS = [
  { x: 38.5, y: 19.5, tag: 'IN-7352' },
  { x: 46, y: 24.8, tag: 'MV-1180' },
  { x: 71, y: 58, tag: 'FK-9044' },
  { x: 72.5, y: 46, tag: 'IN-2216' },
]
const ANOMALIES = [
  { x: 43, y: 37, tag: 'SST-ANOM', severity: 'critical' },
  { x: 55, y: 52, tag: 'TH-WATCH', severity: 'watch' },
  { x: 76, y: 41.5, tag: 'VESSEL-ROAM', severity: 'observed' },
  { x: 20.5, y: 47.5, tag: 'UPWELL-SOM', severity: 'observed' },
]
const REGIONS = [
  { x: 40, y: 43.5, text: 'Arabian Sea', cls: '' },
  { x: 70.5, y: 34.5, text: 'Bay of Bengal', cls: '' },
  { x: 45, y: 90, text: 'Indian Ocean', cls: 'lg' },
  { x: 21.5, y: 35.4, text: 'Gulf of Aden', cls: 'sm' },
  { x: 53.6, y: 38.4, text: 'Lakshadweep', cls: 'sm' },
  { x: 54.4, y: 56.5, text: 'Maldives', cls: 'sm' },
  { x: 79, y: 43, text: 'Andaman Sea', cls: 'sm' },
  { x: 62.6, y: 44.6, text: 'Sri Lanka', cls: 'sm' },
  { x: 4, y: 64, text: 'Africa', cls: 'land sm' },
  { x: 22, y: 22, text: 'Arabia', cls: 'land sm' },
  { x: 60, y: 12, text: 'India', cls: 'land' },
]

/* ---- COASTAL ACTIVITY layer (bands unchanged) ------------------ */

const ACT_BANDS = [
  { lvl: 'med', pts: [[46.1,12],[46.8,14],[47.3,15.5],[48,16],[48.3,17.6],[48.6,19.5]] },
  { lvl: 'high', pts: [[48.6,19.5],[49.6,20.9],[50.35,22],[50.65,23.3],[50.9,25],[51.1,26.8]] },
  { lvl: 'high', pts: [[51.5,29.5],[52.5,32.4],[53.5,35.2],[54.2,37.6],[54.5,39.6],[54.9,41.6],[55.4,43.4]] },
  { lvl: 'high', pts: [[55.9,43.8],[56.6,42.2],[57.6,40.4],[58.5,38.2],[59.1,36],[59.2,34],[59.3,32]] },
  { lvl: 'high', pts: [[59.3,32],[59.4,30],[60,27.6],[61,26.3],[61.5,26],[62.3,25],[62.7,24.6],[63.5,23.4]] },
  { lvl: 'med', pts: [[63.5,23.4],[64.8,21.4],[65.7,20.3],[66.6,19.4],[67.8,18.2]] },
  { lvl: 'med', pts: [[67.9,17.8],[68.3,16.8],[68.8,16.5],[69.4,16.4],[70.5,15.9],[72.1,15.2]] },
]
const ACT_BLOB_SIZE = {
  high: { rx: 2.4, ry: 2.8, op: 0.5 },
  med: { rx: 1.8, ry: 2.1, op: 0.34 },
}
const ACT_BLOBS = ACT_BANDS.flatMap((b) =>
  b.pts.map((p) => ({ x: p[0], y: p[1], ...ACT_BLOB_SIZE[b.lvl] }))
)

/* ---- COASTAL ACTIVITY named places (geographic labels) ---------
   x,y anchored to the drawn coastline. minK = zoom level at which
   the label appears (progressive reveal: zoom in for local detail). */
const COAST_PLACES = [
  // Gujarat
  { id: 'jakhau', name: 'Jakhau', x: 46.1, y: 13.7, level: 'medium', minK: 3, drivers: ['Marine fisheries'] },
  { id: 'porbandar', name: 'Porbandar', x: 47.4, y: 16.1, level: 'high', minK: 1.8, drivers: ['Marine fisheries', 'Fishing infrastructure'] },
  { id: 'veraval', name: 'Veraval', x: 48.05, y: 17.7, level: 'high', minK: 1, drivers: ['Marine fisheries', 'Fishing infrastructure'] },
  { id: 'mangrol', name: 'Mangrol', x: 48.2, y: 18.2, level: 'medium', minK: 3, drivers: ['Marine fisheries'] },
  // West coast
  { id: 'mumbai', name: 'Mumbai', x: 50.65, y: 21.8, level: 'high', minK: 1, drivers: ['Coastal population', 'Marine fisheries', 'Fishing infrastructure'] },
  { id: 'ratnagiri', name: 'Ratnagiri', x: 51.1, y: 25.9, level: 'medium', minK: 1.8, drivers: ['Marine fisheries', 'Coastal population'] },
  { id: 'goa', name: 'Goa', x: 51.75, y: 28.9, level: 'medium', minK: 1.6, drivers: ['Marine fisheries', 'Coastal population'] },
  { id: 'mangalore', name: 'Mangalore', x: 53.15, y: 34.1, level: 'medium', minK: 1.9, drivers: ['Marine fisheries', 'Coastal population'] },
  { id: 'kochi', name: 'Kochi', x: 54.75, y: 39.5, level: 'high', minK: 1, drivers: ['Coastal population', 'Marine fisheries', 'Landing & harbour infrastructure'] },
  { id: 'kollam', name: 'Kollam', x: 55.1, y: 41.6, level: 'medium', minK: 2, drivers: ['Marine fisheries', 'Landing & harbour infrastructure'] },
  { id: 'trivandrum', name: 'Thiruvananthapuram', x: 55.35, y: 43.0, level: 'medium', minK: 2.4, drivers: ['Marine fisheries', 'Fishing infrastructure'] },
  // East coast
  { id: 'thoothukudi', name: 'Thoothukudi', x: 56.7, y: 43.1, level: 'high', minK: 1.7, drivers: ['Marine fisheries', 'Fishing infrastructure'] },
  { id: 'chennai', name: 'Chennai', x: 58.9, y: 33.9, level: 'high', minK: 1, drivers: ['Coastal population', 'Marine fisheries', 'Port & landing infrastructure'] },
  { id: 'kakinada', name: 'Kakinada', x: 61.25, y: 25.8, level: 'high', minK: 1.8, drivers: ['Port & fisheries infrastructure', 'Marine fisheries'] },
  { id: 'vizag', name: 'Visakhapatnam', x: 62.55, y: 24.5, level: 'high', minK: 1, drivers: ['Port & fisheries infrastructure', 'Marine fisheries', 'Coastal population'] },
  { id: 'paradip', name: 'Paradip', x: 66.35, y: 19.5, level: 'medium', minK: 1, drivers: ['Marine fisheries', 'Fishing infrastructure'] },
  { id: 'puri', name: 'Puri', x: 65.35, y: 20.6, level: 'medium', minK: 2.2, drivers: ['Marine fisheries', 'Coastal population'] },
  { id: 'digha', name: 'Digha', x: 67.3, y: 16.7, level: 'medium', minK: 1.6, drivers: ['Coastal population', 'Estuarine & marine fisheries'] },
]
const LEVEL_TEXT = { high: 'High activity', medium: 'Medium activity' }

const GRID_LABELS_LON = GRID_V.map((g) => ({ ...g, text: `${g.lon}°E` }))
const GRID_LABELS_LAT = GRID_H.map((g) => ({ ...g, text: `${Math.abs(g.lat)}°${g.lat >= 0 ? 'N' : 'S'}` }))

const SEV = { critical: 'sev-critical', watch: 'sev-watch', observed: 'sev-observed' }
const trackPath = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ')

const MIN_K = 1
const MAX_K = 9
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const fmtLon = (cx) => `${(30 + (cx / 100) * 85).toFixed(1)}°E`
const fmtLat = (cy) => { const d = 30 - (cy / 100) * 50; return `${Math.abs(d).toFixed(1)}°${d >= 0 ? 'N' : 'S'}` }

export default function OceanMap() {
  const [view, setView] = useState({ k: 1, cx: 50, cy: 50 })
  const [dragging, setDragging] = useState(false)
  const [sel, setSel] = useState(null)
  const mapRef = useRef(null)
  const viewRef = useRef(view)
  viewRef.current = view
  const drag = useRef(null)

  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const mx = ((e.clientX - rect.left) / rect.width) * 100
      const my = ((e.clientY - rect.top) / rect.height) * 100
      const factor = Math.exp(-e.deltaY * 0.0015)
      setView((prev) => {
        const k2 = clamp(prev.k * factor, MIN_K, MAX_K)
        const half = 50 / prev.k
        const half2 = 50 / k2
        const tx = (mx / 100) * 2 - 1
        const ty = (my / 100) * 2 - 1
        return {
          k: k2,
          cx: clamp(prev.cx + tx * (half - half2), half2, 100 - half2),
          cy: clamp(prev.cy + ty * (half - half2), half2, 100 - half2),
        }
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const zoomBy = (factor) => {
    setView((prev) => {
      const k2 = clamp(prev.k * factor, MIN_K, MAX_K)
      const half2 = 50 / k2
      return { k: k2, cx: clamp(prev.cx, half2, 100 - half2), cy: clamp(prev.cy, half2, 100 - half2) }
    })
  }
  const resetView = () => setView({ k: 1, cx: 50, cy: 50 })

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    setSel(null)
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { px: e.clientX, py: e.clientY, ...viewRef.current }
    setDragging(true)
  }
  const onPointerMove = (e) => {
    if (!drag.current) return
    const rect = mapRef.current.getBoundingClientRect()
    const span = 100 / viewRef.current.k
    const dxW = ((e.clientX - drag.current.px) * span) / rect.width
    const dyW = ((e.clientY - drag.current.py) * span) / rect.height
    const half = 50 / viewRef.current.k
    setView((prev) => ({
      k: prev.k,
      cx: clamp(drag.current.cx - dxW, half, 100 - half),
      cy: clamp(drag.current.cy - dyW, half, 100 - half),
    }))
  }
  const endDrag = (e) => {
    if (drag.current) {
      try { e.currentTarget.releasePointerCapture(e.pointerId) } catch (_) {}
      drag.current = null
      setDragging(false)
    }
  }

  const { k, cx, cy } = view
  const half = 50 / k
  const span = 100 / k
  const minX = cx - half
  const minY = cy - half
  const px = (w) => ((w - minX) / span) * 100
  const py = (w) => ((w - minY) / span) * 100
  const onScreen = (p) => p >= -6 && p <= 106

  const visiblePlaces = COAST_PLACES.filter((p) => k >= p.minK)
  const activeSpot = visiblePlaces.find((h) => h.id === sel) || null
  const activeXY = activeSpot ? { x: px(activeSpot.x), y: py(activeSpot.y) } : null

  return (
    <div
      ref={mapRef}
      className={dragging ? 'ocean-map dragging' : 'ocean-map'}
      style={{ touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <svg
        className="ocean-map-svg"
        viewBox={`${minX} ${minY} ${span} ${span}`}
        preserveAspectRatio="none"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id="oceanBase" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0b4066" />
            <stop offset="55%" stopColor="#072b48" />
            <stop offset="100%" stopColor="#041c2e" />
          </linearGradient>
          <radialGradient id="sstHot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff8a3d" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#ffcf5c" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffcf5c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sstCool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3aa9ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3aa9ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3425" />
            <stop offset="60%" stopColor="#132619" />
            <stop offset="100%" stopColor="#0b1810" />
          </linearGradient>
          <filter id="blurBlob" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4.2" />
          </filter>
          <filter id="actBlur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation={3 / k} />
          </filter>
        </defs>

        <rect x={minX} y={minY} width={span} height={span} fill="url(#oceanBase)" />

        <g stroke="#bfe9fa" strokeWidth={0.14 / k} strokeOpacity="0.05">
          {GRID_V.map((g) => <line key={`v${g.lon}`} x1={g.x} y1={minY} x2={g.x} y2={minY + span} />)}
          {GRID_H.map((g) => <line key={`h${g.lat}`} x1={minX} y1={g.y} x2={minX + span} y2={g.y} />)}
        </g>

        <g className="current-lines" stroke="#9fd8ef" strokeOpacity="0.09" fill="none">
          {CURRENTS.map((d, i) => <path key={i} d={d} strokeWidth={0.5 / k} />)}
        </g>

        <g fill="url(#landGrad)" stroke="#3f6a46" strokeWidth={0.35 / k} strokeLinejoin="round">
          <path d={P(AFRICA)} />
          <path d={P(EURASIA)} />
          <path d={P(SUMATRA)} />
          <path d={P(JAVA)} />
          <path d={P(SRI_LANKA)} />
        </g>

        <g fill="#1e3425" stroke="#3f6a46" strokeWidth={0.2 / k}>
          {Object.values(ISLETS).flat().map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={0.5 / k} />
          ))}
        </g>

        <g filter="url(#blurBlob)">
          {SST_WARM.map((b, i) => <ellipse key={`w${i}`} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill="url(#sstHot)" />)}
          {SST_COOL.map((b, i) => <ellipse key={`c${i}`} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill="url(#sstCool)" />)}
        </g>

        {CHL_PLUMES.map((c, i) => (
          <polygon key={i} points={c.pts.map((p) => p.join(',')).join(' ')}
            fill="rgba(43,208,138,0.11)" stroke="rgba(43,208,138,0.3)" strokeWidth={0.26 / k} />
        ))}

        {FISHING_ZONES.map((z) => (
          <polygon key={z.id} points={z.pts.map((p) => p.join(',')).join(' ')}
            fill="rgba(245,169,78,0.06)" stroke="rgba(245,169,78,0.4)" strokeWidth={0.3 / k} strokeDasharray="1 0.8" />
        ))}

        {TRACKS.map((t) => (
          <path key={t.tag} d={trackPath(t.pts)} fill="none" className={`vessel-track ${t.cls}`}
            stroke="#9fd8ef" strokeWidth={0.32 / k} strokeDasharray="1.5 1.1" opacity="0.8" />
        ))}

        {/* COASTAL ACTIVITY bands (unchanged) */}
        <g filter="url(#actBlur)" fill="#ffc06b">
          {ACT_BLOBS.map((b, i) => (
            <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx / k} ry={b.ry / k} opacity={b.op} />
          ))}
        </g>

        <circle cx="58.3" cy="52.5" r={6 / k} fill="#2bd08a" fillOpacity="0.09" stroke="#2bd08a" strokeOpacity="0.35" strokeWidth={0.25 / k} />
      </svg>

      <div className="map-sweep" aria-hidden="true" />

      {GRID_LABELS_LON.map((g) => {
        const x = px(g.x)
        return onScreen(x) ? <span key={`gl${g.lon}`} className="grid-label grid-label-lon" style={{ left: `${x}%` }}>{g.text}</span> : null
      })}
      {GRID_LABELS_LAT.map((g) => {
        const y = py(g.y)
        return onScreen(y) ? <span key={`gl${g.lat}`} className="grid-label grid-label-lat" style={{ top: `${y}%` }}>{g.text}</span> : null
      })}
      {REGIONS.map((r, i) => {
        const x = px(r.x); const y = py(r.y)
        return onScreen(x) && onScreen(y)
          ? <span key={i} className={`region-label ${r.cls}`} style={{ left: `${x}%`, top: `${y}%` }}>{r.text}</span>
          : null
      })}
      {FISHING_ZONES.map((z) => {
        const x = px(z.x); const y = py(z.y)
        return onScreen(x) && onScreen(y)
          ? <div key={z.id} className="fishing-chip" style={{ left: `${x}%`, top: `${y}%` }}>{z.id} · TRAWL</div>
          : null
      })}
      {VESSELS.map((v) => {
        const x = px(v.x); const y = py(v.y)
        return onScreen(x) && onScreen(y) ? (
          <div key={v.tag} className="map-vessel" style={{ left: `${x}%`, top: `${y}%` }}>
            <Ship size={12} strokeWidth={2} />
            <span className="ais-tag">{v.tag}</span>
          </div>
        ) : null
      })}
      {(() => {
        const x = px(58.3); const y = py(52.5)
        return onScreen(x) && onScreen(y) ? (
          <div className="map-sightings" style={{ left: `${x}%`, top: `${y}%` }}>
            <Fish size={13} strokeWidth={2} className="fish fish-1" />
            <Fish size={10} strokeWidth={2} className="fish fish-2" />
          </div>
        ) : null
      })()}
      {ANOMALIES.map((a, i) => {
        const x = px(a.x); const y = py(a.y)
        return onScreen(x) && onScreen(y) ? (
          <div key={i} className={`map-anomaly ${SEV[a.severity] ?? 'sev-critical'}`} style={{ left: `${x}%`, top: `${y}%` }}>
            <span className="map-anomaly-pulse" />
            <TriangleAlert size={12} strokeWidth={2.3} />
            <span className="map-anomaly-tag">{a.tag}</span>
          </div>
        ) : null
      })}

      {/* COASTAL ACTIVITY — named places, progressive on zoom */}
      {visiblePlaces.map((p) => {
        const x = px(p.x); const y = py(p.y)
        if (!onScreen(x) || !onScreen(y)) return null
        const isActive = sel === p.id
        return (
          <div
            key={p.id}
            className={`coast-place lvl-${p.level}${isActive ? ' active' : ''}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            onMouseEnter={() => setSel(p.id)}
            onMouseLeave={() => setSel((s) => (s === p.id ? null : s))}
            onClick={(e) => { e.stopPropagation(); setSel((s) => (s === p.id ? null : p.id)) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span className="coast-dot" />
            <span className="coast-name">{p.name}</span>
          </div>
        )
      })}

      {/* COASTAL ACTIVITY info popover */}
      {activeSpot && activeXY && onScreen(activeXY.x) && onScreen(activeXY.y) && (
        <div className="activity-pop glass-panel" style={{ left: `${activeXY.x}%`, top: `${activeXY.y}%` }}>
          <span className="activity-pop-name">{activeSpot.name}</span>
          <span className={`activity-pop-level lvl-${activeSpot.level}`}>{LEVEL_TEXT[activeSpot.level]}</span>
          <span className="activity-pop-drivers-title">Primary drivers</span>
          <ul className="activity-pop-drivers">
            {activeSpot.drivers.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
      )}

      {(() => {
        const x = px(46.8); const y = py(26.5)
        return onScreen(x) && onScreen(y) ? (
          <div className="map-tooltip glass-panel" style={{ left: `${x}%`, top: `${y}%` }}>
            <span className="map-tooltip-title">Chlorophyll · Konkan shelf</span>
            <span className="map-tooltip-value">1.10 mg/m³</span>
          </div>
        ) : null
      })()}

      <div className="map-meta">
        <span className="map-meta-title">Indian Ocean · Ops View</span>
        <span className="map-meta-sub">CENTER {fmtLat(cy)} {fmtLon(cx)} · ZOOM ×{k.toFixed(1)} · GRID 10°</span>
      </div>

      <div className="activity-legend">
        <span className="activity-legend-title">Coastal Activity</span>
        <span className="activity-legend-bar" />
        <span className="activity-legend-caps"><i>Low</i><i>High</i></span>
        <span className="activity-legend-note">Illustrative index · population &amp; fisheries</span>
      </div>

      <div className="map-zoom">
        <button aria-label="Zoom in" onClick={() => zoomBy(1.6)}><Plus size={15} strokeWidth={2.3} /></button>
        <button aria-label="Zoom out" onClick={() => zoomBy(1 / 1.6)}><Minus size={15} strokeWidth={2.3} /></button>
        <button aria-label="Reset view" className="map-zoom-locate" onClick={resetView}><LocateFixed size={14} strokeWidth={2.2} /></button>
      </div>
      <div className="map-globe">
        <div className="map-globe-frame"><div className="map-globe-viewport" /></div>
      </div>
    </div>
  )
}
