import { Rectangle, Tooltip } from 'react-leaflet'
import { isNum } from '../lib/format'

// Safe cells read as instrumentation blue so green stays exclusive to PFZ.
const COLOR = { danger: '#FF5C5C', caution: '#F5B942', safe: '#22B8FF' }

const validBounds = (b) =>
  Array.isArray(b) &&
  b.length === 2 &&
  Array.isArray(b[0]) &&
  Array.isArray(b[1]) &&
  isNum(b[0][0]) &&
  isNum(b[0][1]) &&
  isNum(b[1][0]) &&
  isNum(b[1][1])

/** Sea-state grid overlay (SST / wave / safety grading). */
export default function SeaStateLayer({ grid = [] }) {
  return grid
    .filter((c) => c && validBounds(c.bounds))
    .map((c, i) => {
      const color = COLOR[c.safety] || COLOR.safe
      return (
        <Rectangle
          key={c.label || i}
          bounds={c.bounds}
          pathOptions={{
            color,
            weight: 0.6,
            fillColor: color,
            fillOpacity: 0.13,
          }}
        >
          <Tooltip direction="center" opacity={1}>
            <span className="font-mono text-[10px]">
              {c.label}
              {isNum(c.sst) ? ` · SST ${c.sst}°` : ''}
              {isNum(c.wave) ? ` · ${c.wave} m` : ''}
            </span>
          </Tooltip>
        </Rectangle>
      )
    })
}
