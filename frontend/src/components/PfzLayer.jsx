import { Fragment } from 'react'
import { Circle, Marker, Tooltip } from 'react-leaflet'
import { pfzIcon } from '../lib/mapIcons'
import { isNum } from '../lib/format'

const fillFor = (confidence) =>
  confidence === 'High' ? 0.26 : confidence === 'Medium' ? 0.16 : 0.09

/** Potential Fishing Zones — green, the only green on the chart. */
export default function PfzLayer({ zones = [], onZoneTap }) {
  return zones
    .filter((z) => z && isNum(z.lat) && isNum(z.lng))
    .map((z, i) => (
      <Fragment key={z.label || i}>
        <Circle
          center={[z.lat, z.lng]}
          radius={isNum(z.radius) ? z.radius : 10000}
          pathOptions={{
            color: '#2EE6A6',
            weight: 1.5,
            fillColor: '#2EE6A6',
            fillOpacity: fillFor(z.confidence),
          }}
          eventHandlers={{ click: () => onZoneTap?.(z) }}
        />
        <Marker
          position={[z.lat, z.lng]}
          icon={pfzIcon}
          eventHandlers={{ click: () => onZoneTap?.(z) }}
        >
          <Tooltip direction="top" offset={[0, -6]} opacity={1}>
            <span className="font-mono text-[11px]">
              {z.label}
              {z.species ? ` · ${z.species}` : ''}
            </span>
          </Tooltip>
        </Marker>
      </Fragment>
    ))
}
