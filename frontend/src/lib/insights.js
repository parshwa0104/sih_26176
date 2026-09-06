import { num } from './format'

const rank = (c) => (c === 'High' ? 3 : c === 'Medium' ? 2 : 1)

/**
 * Derive actionable AI insights purely from the data the backend already
 * returns (no fabricated numbers). Returns up to 4 insights.
 *
 * Each insight: { id, severity, title, detail, action }
 *   severity: 'safe' | 'caution' | 'danger' | 'accent'
 *   action:   { type: 'map', center: [lat,lng], zoom } | { type: 'ask', query } | null
 */
export function deriveInsights({ conditions, pfzZones = [], safetyStatus, t }) {
  const out = []

  // 1. Safety posture
  if (safetyStatus === 'danger') {
    out.push({
      id: 'safety',
      severity: 'danger',
      title: t.insightSafetyWarnTitle,
      detail: conditions?.craft_advisory || t.danger,
      action: { type: 'ask', query: 'Is it safe to go out today?' },
    })
  } else if (safetyStatus === 'caution') {
    out.push({
      id: 'safety',
      severity: 'caution',
      title: t.insightRiskTitle,
      detail: conditions?.craft_advisory || t.caution,
      action: { type: 'ask', query: 'Is it safe to go out today?' },
    })
  }

  // 2. Best fishing zone available
  const best = [...pfzZones]
    .filter((z) => z && typeof z.lat === 'number')
    .sort((a, b) => rank(b.confidence) - rank(a.confidence))[0]
  if (best) {
    out.push({
      id: 'pfz',
      severity: 'safe',
      title: t.insightPfzTitle,
      detail: [best.label, best.species, best.description].filter(Boolean).join(' · '),
      action: { type: 'map', center: [best.lat, best.lng], zoom: 9 },
    })
  }

  // 3. Favorable ocean conditions
  if (
    conditions?.sst_range &&
    String(conditions.sst_range).toLowerCase().includes('optimal') &&
    safetyStatus !== 'danger'
  ) {
    const loc = conditions.user_location
    out.push({
      id: 'cond',
      severity: 'safe',
      title: t.insightSafeTitle,
      detail: `SST ${conditions.sst} · Chl-a ${conditions.chlorophyll}`,
      action: loc ? { type: 'map', center: [loc.lat, loc.lng], zoom: 9 } : null,
    })
  }

  // 4. Wind / wave risk straight from conditions
  const wind = num(conditions?.wind_speed)
  if (wind != null && wind >= 20) {
    out.push({
      id: 'wind',
      severity: wind >= 30 ? 'danger' : 'caution',
      title: t.insightRiskTitle,
      detail: `Wind ${conditions.wind_speed} · Waves ${conditions.wave_height}`,
      action: { type: 'ask', query: 'What are the sea conditions right now?' },
    })
  }

  // 5. Most recent advisory
  const alert = conditions?.alerts?.[0]
  if (alert) {
    out.push({
      id: 'alert',
      severity: alert.type === 'warning' ? 'caution' : 'accent',
      title: t.insightAlertTitle,
      detail: [alert.text, alert.time].filter(Boolean).join(' · '),
      action: null,
    })
  }

  // De-dupe by title, keep first, cap at 4
  const seen = new Set()
  return out.filter((i) => (seen.has(i.title) ? false : seen.add(i.title))).slice(0, 4)
}
