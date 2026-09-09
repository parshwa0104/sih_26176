import L from 'leaflet'
import { CHART, SIGNAL } from './chartColors'

// On-brand Leaflet markers as SVG divIcons — nothing depends on Leaflet's
// default marker images (which break under bundlers), and the shapes read as
// chart symbology rather than dropped pins. The vessel and PFZ marks echo the
// sonar reticle in the brand glyph.

function icon({ svg, size, color, ping }) {
  const half = size / 2
  const html = ping
    ? `<span style="position:relative;display:block">${svg}` +
      `<span class="orca-dot-ping" style="border-color:${color}"></span></span>`
    : svg
  return L.divIcon({
    className: 'orca-marker',
    html,
    iconSize: [size, size],
    iconAnchor: [half, half],
    popupAnchor: [0, -half + 2],
    tooltipAnchor: [0, -half + 2],
  })
}

/** Your vessel — a ringed disc with a bright core. Sits calm; no ping. */
export const vesselIcon = icon({
  size: 22,
  color: CHART.vessel,
  svg:
    `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">` +
    `<circle cx="11" cy="11" r="9" fill="none" stroke="${CHART.vessel}" stroke-width="2"/>` +
    `<circle cx="11" cy="11" r="4.4" fill="${CHART.vessel}"/>` +
    `<circle cx="11" cy="11" r="1.6" fill="#fff"/></svg>`,
})

/** Potential fishing zone — a reticle in the one green on the chart. */
export const pfzIcon = icon({
  size: 22,
  color: CHART.pfz,
  svg:
    `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">` +
    `<circle cx="11" cy="11" r="7.5" fill="${CHART.pfz}" fill-opacity="0.18" stroke="${CHART.pfz}" stroke-width="1.6"/>` +
    `<circle cx="11" cy="11" r="2.4" fill="${CHART.pfz}"/>` +
    `<g stroke="${CHART.pfz}" stroke-width="1.6" stroke-linecap="round">` +
    `<line x1="11" y1="1.5" x2="11" y2="4"/><line x1="11" y1="18" x2="11" y2="20.5"/>` +
    `<line x1="1.5" y1="11" x2="4" y2="11"/><line x1="18" y1="11" x2="20.5" y2="11"/></g></svg>`,
})

/** Route waypoint — a small diamond along the leg. */
export const waypointIcon = icon({
  size: 18,
  color: CHART.route,
  svg:
    `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">` +
    `<rect x="4" y="4" width="10" height="10" rx="1.5" transform="rotate(45 9 9)" ` +
    `fill="${CHART.route}" stroke="#fff" stroke-width="1.5"/></svg>`,
})

/** Hazard — a warning triangle. Keeps the ping: this is the "look here". */
export const dangerIcon = icon({
  size: 22,
  color: SIGNAL.danger,
  ping: true,
  svg:
    `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">` +
    `<path d="M11 2.5 L20 19 L2 19 Z" fill="${SIGNAL.danger}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>` +
    `<rect x="10" y="8" width="2" height="5.5" rx="1" fill="#fff"/>` +
    `<circle cx="11" cy="16.4" r="1.15" fill="#fff"/></svg>`,
})

/** Port / neutral point — a quiet rounded square. */
export const portIcon = icon({
  size: 16,
  color: CHART.port,
  svg:
    `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">` +
    `<rect x="3" y="3" width="10" height="10" rx="2.5" fill="${CHART.port}" stroke="#fff" stroke-width="1.5"/></svg>`,
})

/** One-shot arrival ring, dropped where a query result lands. */
export const arrivalIcon = L.divIcon({
  className: 'orca-marker',
  html: '<span class="orca-arrival"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})
