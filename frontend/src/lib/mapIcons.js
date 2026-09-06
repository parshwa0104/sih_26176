import L from 'leaflet'

// On-brand Leaflet markers built as divIcons so nothing depends on Leaflet's
// default marker image assets (which break under bundlers).

function make({ color, shadow, ping }) {
  return L.divIcon({
    className: 'orca-marker',
    html:
      `<span class="orca-dot" style="background:${color};box-shadow:0 0 10px 2px ${shadow}">` +
      (ping ? `<span class="orca-dot-ping" style="border-color:${color}"></span>` : '') +
      `</span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -9],
    tooltipAnchor: [0, -9],
  })
}

export const vesselIcon = make({ color: '#36CFFF', shadow: 'rgba(54,207,255,0.55)', ping: true })
export const pfzIcon = make({ color: '#2EE6A6', shadow: 'rgba(46,230,166,0.5)' })
export const waypointIcon = make({ color: '#22B8FF', shadow: 'rgba(34,184,255,0.5)' })
export const dangerIcon = make({ color: '#FF5C5C', shadow: 'rgba(255,92,92,0.55)', ping: true })
export const portIcon = make({ color: '#9DB8D0', shadow: 'rgba(157,184,208,0.4)' })
