// Canonical colours for map vectors, markers, gauges and status lights.
//
// Leaflet `pathOptions` and inline `style` need literal colour strings, so
// this module is the single source for those. Anything expressed as a
// className should use the Tailwind tokens instead (`chart.*`, `status.*`).
// Keep these values in sync with tailwind.config.js.

/** The deep marine-teal accent, as hex + rgb triplet (for rgba() / gradients). */
export const ACCENT = '#0B6472'
export const ACCENT_RGB = '11, 100, 114'

/** Chart vectors — vessel track, routes, ports, fishing zones. */
export const CHART = {
  vessel: '#0B6472', // the user's own boat — accent teal
  route: '#1C7FA6', // route lines + waypoints — a distinct marine blue
  port: '#6E8A86', // neutral / port markers
  pfz: '#17A472', // potential fishing zone — the only green on the chart
}

/** Signal colours — status lights, gauges, safety fills. One hue family with
 *  the `status.*` chrome tokens, tuned brighter so they read as map fills. */
export const SIGNAL = {
  safe: '#17A472',
  caution: '#DA9226',
  danger: '#DC3B2C',
  unknown: '#7C8F8B',
}
