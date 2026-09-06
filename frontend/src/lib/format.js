// Small pure helpers shared across ORCA components.

/** Join truthy class names. */
export const cx = (...parts) => parts.filter(Boolean).join(' ')

/** True only for real, finite numbers. */
export const isNum = (v) => typeof v === 'number' && Number.isFinite(v)

/** Parse the leading number out of strings like "12.8 m/s" or "28.5°C". */
export const num = (v) => {
  if (isNum(v)) return v
  const m = String(v ?? '').match(/-?\d+(\.\d+)?/)
  return m ? parseFloat(m[0]) : null
}

/** Format a lat/lng pair as an instrument-style coordinate readout. */
export const fmtCoord = (lat, lng) => {
  if (!isNum(lat) || !isNum(lng)) return '-- --'
  const part = (x, pos, neg) => `${Math.abs(x).toFixed(3)}° ${x >= 0 ? pos : neg}`
  return `${part(lat, 'N', 'S')}  ${part(lng, 'E', 'W')}`
}

/** Clamp helper for gauges. */
export const clamp01 = (n) => Math.max(0, Math.min(1, n))
