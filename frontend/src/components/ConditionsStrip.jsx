import { Thermometer, Wind, Waves as WavesIcon, Droplets } from 'lucide-react'
import Skeleton from './Skeleton'
import { CHART, SIGNAL } from '../lib/chartColors'
import { num, clamp01, cx } from '../lib/format'

const STATUS_TEXT = {
  safe: 'text-status-safe',
  caution: 'text-status-caution',
  danger: 'text-status-danger',
}

const gaugeTone = (v, hi, mid) => (v >= hi ? SIGNAL.danger : v >= mid ? SIGNAL.caution : CHART.route)

/** One cell of the secondary instrument row: label / value / gauge underline. */
function Cell({ icon: Icon, label, value, meter }) {
  const pct = meter && meter.value != null ? clamp01(meter.value / meter.max) * 100 : null
  return (
    <div className="min-w-0 px-2 py-2">
      <div className="flex items-start gap-1 font-mono text-meta uppercase leading-none text-ink-dim">
        <Icon size={10} className="mt-px shrink-0 text-accent" />
        <span className="min-w-0">{label}</span>
      </div>
      <div className="mt-1.5 truncate font-mono text-body font-semibold text-ink">{value ?? '—'}</div>
      <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-ink/[0.08]">
        {pct != null && (
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-instr"
            style={{ width: `${pct}%`, background: meter.tone }}
          />
        )}
      </div>
    </div>
  )
}

/** Ocean conditions readout panel — instrument styling, strong number hierarchy. */
export default function ConditionsStrip({
  conditions,
  safetyStatus,
  loading,
  t,
  className = '',
  hideHeader = false,
}) {
  if (loading) {
    return (
      <section className={cx('border-b border-hairline p-block', className)}>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-3 h-16 w-full" />
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      </section>
    )
  }

  if (!conditions) {
    return (
      <section className={cx('border-b border-hairline p-block', className)}>
        <h2 className="font-display text-label uppercase text-ink-dim">{t.conditionsTitle}</h2>
        <p className="mt-3 text-body text-ink-dim">{t.backendDown}</p>
      </section>
    )
  }

  const wind = num(conditions.wind_speed)
  const wave = num(conditions.wave_height)
  const isOptimal = String(conditions.sst_range || '').toLowerCase().includes('optimal')

  return (
    <section className={cx('border-b border-hairline p-block', className)} aria-label={t.conditionsTitle}>
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <h2 className="font-display text-label uppercase text-ink">{t.conditionsTitle}</h2>
          {conditions.location && (
            <span className="flex items-center gap-1 font-mono text-meta uppercase text-ink-dim">
              {conditions.location}
            </span>
          )}
        </div>
      )}

      {/* Primary readout: SST — the headline, flush on the panel, no box. */}
      <div className="mt-3 animate-fade-up">
        <div className="flex items-center gap-field font-mono text-meta uppercase text-ink-dim">
          <Thermometer size={11} className="text-accent" />
          {t.metricSst}
        </div>
        <div className="mt-0.5 flex items-end gap-2">
          <span className="font-mono text-readout-xl text-ink">{conditions.sst}</span>
          {conditions.sst_range && (
            <span
              className={cx(
                'mb-1.5 text-meta uppercase',
                isOptimal ? 'text-status-safe' : 'text-ink-dim',
              )}
            >
              {conditions.sst_range}
            </span>
          )}
        </div>
      </div>

      {/* Secondary instruments: one divided readout strip, not competing cards. */}
      <div className="mt-3 grid grid-cols-3 divide-x divide-hairline rounded-xl border border-hairline bg-surface-1/50">
        <Cell
          icon={Wind}
          label={t.metricWind}
          value={conditions.wind_speed}
          meter={{ value: wind, max: 45, tone: gaugeTone(wind, 30, 20) }}
        />
        <Cell
          icon={WavesIcon}
          label={t.metricWave}
          value={conditions.wave_height}
          meter={{ value: wave, max: 5, tone: gaugeTone(wave, 3, 2) }}
        />
        <Cell icon={Droplets} label={t.metricChl} value={conditions.chlorophyll} />
      </div>

      {/* Advisory + provenance */}
      {conditions.craft_advisory && (
        <p
          className={cx(
            'mt-3 rounded-lg border border-hairline bg-surface-1/40 px-2.5 py-2 text-caption',
            STATUS_TEXT[safetyStatus] || 'text-ink',
          )}
        >
          {conditions.craft_advisory}
        </p>
      )}
      <p className="mt-2 font-mono text-meta uppercase text-ink-dim">
        {conditions.source ? `${t.source}: ${conditions.source}` : ''}
        {conditions.updated ? ` · ${t.asOf} ${conditions.updated}` : ''}
      </p>
    </section>
  )
}
