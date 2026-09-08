import { Fragment } from 'react'
import { Circle, Polygon, Polyline, Marker, Popup, Tooltip } from 'react-leaflet'
import { Fish, ShieldAlert, ShieldCheck, CloudSun, Navigation, Ban } from 'lucide-react'
import { waypointIcon, dangerIcon, pfzIcon, arrivalIcon } from '../lib/mapIcons'
import { CHART, SIGNAL } from '../lib/chartColors'
import { isNum } from '../lib/format'
import MapCard from './MapCard'

const SAFETY_COLOR = { danger: SIGNAL.danger, caution: SIGNAL.caution, safe: SIGNAL.safe }

/** A short-lived ring at the point a query result lands — "here's the answer". */
function Arrival({ lat, lng }) {
  return <Marker key={`arr-${lat},${lng}`} position={[lat, lng]} icon={arrivalIcon} interactive={false} />
}

/**
 * Renders the `map_data` object returned by POST /query. Every branch guards
 * its own coordinates; unknown / null / malformed data renders nothing.
 */
export default function QueryOverlay({ data, t }) {
  if (!data || typeof data !== 'object') return null

  // ── PFZ ──
  if (data.type === 'pfz' && isNum(data.lat) && isNum(data.lng)) {
    const rows = []
    if (isNum(data.distance_km)) rows.push([t.routeDistance || 'Distance', `${data.distance_km} ${t.km}`])
    return (
      <Fragment>
        <Circle
          center={[data.lat, data.lng]}
          radius={isNum(data.radius) ? data.radius : 12000}
          pathOptions={{ color: CHART.pfz, weight: 2, fillColor: CHART.pfz, fillOpacity: 0.16, dashArray: '6 6' }}
        />
        <Arrival lat={data.lat} lng={data.lng} />
        <Marker position={[data.lat, data.lng]} icon={pfzIcon}>
          <Popup>
            <MapCard accent={CHART.pfz} icon={Fish} title={t.legendPfz} rows={rows} note={data.info} />
          </Popup>
        </Marker>
      </Fragment>
    )
  }

  // ── Safety ──
  if (data.type === 'safety' && isNum(data.lat) && isNum(data.lng)) {
    const color = SAFETY_COLOR[data.status] || CHART.route
    const word =
      data.status === 'danger' ? t.legendDanger : data.status === 'caution' ? t.legendCaution : t.legendSafe
    return (
      <Fragment>
        <Circle
          center={[data.lat, data.lng]}
          radius={30000}
          pathOptions={{ color, weight: 2, fillColor: color, fillOpacity: 0.13 }}
        />
        <Arrival lat={data.lat} lng={data.lng} />
        <Marker position={[data.lat, data.lng]} icon={data.status === 'danger' ? dangerIcon : waypointIcon}>
          <Popup>
            <MapCard
              accent={color}
              icon={data.status === 'danger' ? ShieldAlert : ShieldCheck}
              title={t.safetyTitle || 'Sea safety'}
              tag={word}
              note={data.message}
            />
          </Popup>
        </Marker>
      </Fragment>
    )
  }

  // ── Weather ──
  if (data.type === 'weather' && isNum(data.lat) && isNum(data.lng)) {
    return (
      <Fragment>
        <Arrival lat={data.lat} lng={data.lng} />
        <Marker position={[data.lat, data.lng]} icon={waypointIcon}>
          <Popup>
            <MapCard accent={CHART.route} icon={CloudSun} title={t.conditionsTitle} note={data.info} />
          </Popup>
        </Marker>
      </Fragment>
    )
  }

  // ── Route ──
  if (data.type === 'route' && Array.isArray(data.waypoints)) {
    const pts = data.waypoints.filter((w) => w && isNum(w.lat) && isNum(w.lng))
    if (pts.length < 2) return null
    const rows = []
    if (isNum(data.distance_km)) rows.push([t.routeDistance || 'Distance', `${data.distance_km} ${t.km}`])
    if (isNum(data.estimated_time_hrs)) rows.push([t.routeEta || 'ETA', `${data.estimated_time_hrs} ${t.hrs}`])
    return (
      <Fragment>
        <Polyline
          positions={pts.map((w) => [w.lat, w.lng])}
          pathOptions={{ color: CHART.route, weight: 3, dashArray: '10 8' }}
        >
          {rows.length > 0 && (
            <Popup>
              <MapCard accent={CHART.route} icon={Navigation} title={t.navMap} rows={rows} />
            </Popup>
          )}
        </Polyline>
        {pts.map((w, i) => (
          <Marker key={i} position={[w.lat, w.lng]} icon={waypointIcon}>
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              <span className="font-mono text-meta">{w.label || `WP ${i + 1}`}</span>
            </Tooltip>
          </Marker>
        ))}
      </Fragment>
    )
  }

  // ── Geofence ──
  if (data.type === 'geofence') {
    const ring = Array.isArray(data.bounds)
      ? data.bounds.filter((p) => Array.isArray(p) && isNum(p[0]) && isNum(p[1]))
      : []
    const opts = {
      color: SIGNAL.danger,
      weight: 2,
      fillColor: SIGNAL.danger,
      fillOpacity: 0.16,
      dashArray: '8 6',
    }
    const popup = (
      <Popup>
        <MapCard
          accent={SIGNAL.danger}
          icon={Ban}
          title={data.name || t.legendHazard || t.legendDanger}
          note={data.message}
        />
      </Popup>
    )
    if (ring.length >= 3) {
      return <Polygon positions={ring} pathOptions={opts}>{popup}</Polygon>
    }
    if (isNum(data.lat) && isNum(data.lng)) {
      return (
        <Circle center={[data.lat, data.lng]} radius={20000} pathOptions={{ ...opts, fillOpacity: 0.13 }}>
          {popup}
        </Circle>
      )
    }
    return null
  }

  return null
}
