import { Fragment } from 'react'
import { Circle, Polygon, Polyline, Marker, Popup, Tooltip } from 'react-leaflet'
import { waypointIcon, dangerIcon, pfzIcon } from '../lib/mapIcons'
import { isNum } from '../lib/format'

const SAFETY_COLOR = { danger: '#FF5C5C', caution: '#F5B942', safe: '#2EE6A6' }

/**
 * Renders the `map_data` object returned by POST /query. Every branch guards
 * its own coordinates; unknown / null / malformed data renders nothing.
 */
export default function QueryOverlay({ data, t }) {
  if (!data || typeof data !== 'object') return null

  // ── PFZ ──
  if (data.type === 'pfz' && isNum(data.lat) && isNum(data.lng)) {
    return (
      <Fragment>
        <Circle
          center={[data.lat, data.lng]}
          radius={isNum(data.radius) ? data.radius : 12000}
          pathOptions={{
            color: '#36CFFF',
            weight: 2,
            fillColor: '#36CFFF',
            fillOpacity: 0.16,
            dashArray: '6 6',
          }}
        />
        <Marker position={[data.lat, data.lng]} icon={pfzIcon}>
          <Popup>
            <b>{t.legendPfz}</b>
            {data.info ? (
              <>
                <br />
                {data.info}
              </>
            ) : null}
            {isNum(data.distance_km) ? (
              <>
                <br />
                {data.distance_km} {t.km}
              </>
            ) : null}
          </Popup>
        </Marker>
      </Fragment>
    )
  }

  // ── Safety ──
  if (data.type === 'safety' && isNum(data.lat) && isNum(data.lng)) {
    const color = SAFETY_COLOR[data.status] || '#22B8FF'
    return (
      <Fragment>
        <Circle
          center={[data.lat, data.lng]}
          radius={30000}
          pathOptions={{ color, weight: 2, fillColor: color, fillOpacity: 0.13 }}
        />
        <Marker
          position={[data.lat, data.lng]}
          icon={data.status === 'danger' ? dangerIcon : waypointIcon}
        >
          <Popup>
            <b>{String(data.status || '').toUpperCase() || t.safetyTitle}</b>
            {data.message ? (
              <>
                <br />
                {data.message}
              </>
            ) : null}
          </Popup>
        </Marker>
      </Fragment>
    )
  }

  // ── Route ──
  if (data.type === 'route' && Array.isArray(data.waypoints)) {
    const pts = data.waypoints.filter((w) => w && isNum(w.lat) && isNum(w.lng))
    if (pts.length < 2) return null
    return (
      <Fragment>
        <Polyline
          positions={pts.map((w) => [w.lat, w.lng])}
          pathOptions={{ color: '#22B8FF', weight: 3, dashArray: '10 8' }}
        />
        {pts.map((w, i) => (
          <Marker key={i} position={[w.lat, w.lng]} icon={waypointIcon}>
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              <span className="font-mono text-[10px]">{w.label || `WP ${i + 1}`}</span>
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
    if (ring.length >= 3) {
      return (
        <Polygon
          positions={ring}
          pathOptions={{
            color: '#FF5C5C',
            weight: 2,
            fillColor: '#FF5C5C',
            fillOpacity: 0.16,
            dashArray: '8 6',
          }}
        >
          <Popup>
            <b>⛔ {data.name || t.legendDanger}</b>
          </Popup>
        </Polygon>
      )
    }
    if (isNum(data.lat) && isNum(data.lng)) {
      return (
        <Circle
          center={[data.lat, data.lng]}
          radius={20000}
          pathOptions={{
            color: '#FF5C5C',
            weight: 2,
            fillColor: '#FF5C5C',
            fillOpacity: 0.13,
            dashArray: '8 6',
          }}
        >
          <Popup>
            <b>⛔ {data.name || t.legendDanger}</b>
          </Popup>
        </Circle>
      )
    }
    return null
  }

  return null
}
