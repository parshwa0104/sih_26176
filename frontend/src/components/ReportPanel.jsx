import { useMemo, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Modal from './Modal'

const rank = (c) => (c === 'High' ? 3 : c === 'Medium' ? 2 : 1)

/** "Session Brief" — a printable snapshot assembled from live API data only. */
export default function ReportPanel({ conditions, pfzZones = [], safetyStatus, t, onClose }) {
  const [copied, setCopied] = useState(false)

  const topZone = useMemo(
    () =>
      [...pfzZones]
        .filter((z) => z && z.label)
        .sort((a, b) => rank(b.confidence) - rank(a.confidence))[0],
    [pfzZones],
  )

  const generated = new Date().toLocaleString()
  const safetyWord =
    safetyStatus === 'danger' ? t.danger : safetyStatus === 'caution' ? t.caution : t.safe

  const rows = [
    [t.reportGenerated, generated],
    [t.reportSafety, `${safetyWord}${conditions?.location ? ` · ${conditions.location}` : ''}`],
    [
      t.reportTopZone,
      topZone
        ? `${topZone.label} — ${topZone.species || ''} (${topZone.confidence || '—'})`
        : '—',
    ],
    [
      t.reportConditions,
      conditions
        ? `SST ${conditions.sst} · ${t.wind} ${conditions.wind_speed} · ${t.waves} ${conditions.wave_height} · ${t.chla} ${conditions.chlorophyll}`
        : '—',
    ],
    [t.reportAlerts, conditions?.alerts?.length ? String(conditions.alerts.length) : '0'],
  ]

  const copy = async () => {
    const text = [`ORCA — ${t.reportTitle}`, ...rows.map(([k, v]) => `${k}: ${v}`)].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <Modal title={t.reportTitle} onClose={onClose} closeLabel={t.close}>
      <dl className="divide-y divide-hairline">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[92px_1fr] gap-3 py-2.5 sm:grid-cols-[110px_1fr]">
            <dt className="font-mono text-meta uppercase text-ink-dim">{k}</dt>
            <dd className="text-body text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      {conditions?.alerts?.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-hairline pt-3">
          {conditions.alerts.map((a, i) => (
            <li key={i} className="text-caption text-ink-dim">
              • {a.text} <span className="text-ink-dim/60">({a.time})</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={copy}
        className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-hairline px-3.5 py-2 text-label text-accent transition-colors hover:bg-black/5"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? t.copied : t.copyBrief}
      </button>
    </Modal>
  )
}
