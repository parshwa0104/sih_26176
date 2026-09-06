import { Thermometer, Wind, Waves as WavesIcon, Droplets } from 'lucide-react'
import Skeleton from './Skeleton'
import { num, clamp01, cx } from '../lib/format'

const STATUS_TEXT = {
  safe: 'text-status-safe',
  caution: 'text-status-caution',
  danger: 'text-status-danger',
}

function Gauge({ value, max, tone }) {
  if (value == null) return null
  return (
    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${clamp01(value / max) * 100}%`, background: tone }}
      />
    </div>
  )
}

function Readout({ icon: Icon, label, value, gauge }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface-1/40 p-2.5">
      <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.14em] text-ink-dim">
        <Icon size={11} className="text-accent" />
        {label}
      </div>
      <div className="mt-1 font-mono text-base font-semibold text-ink">{value ?? '—'}</div>
      {gauge}
    </div>
  )
}

/** Ocean conditions readout panel — instrument styling, strong number hierarchy. */
export default function ConditionsStrip({ conditions, safetyStatus, loading, t, className = '' }) {
  if (loading) {
    return (
      <section className={cx('border-b border-hairline p-4', className)}>
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
      <section className={cx('border-b border-hairline p-4', className)}>
        <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-ink-dim">
          {t.conditionsTitle}
        </h2>
        <p className="mt-3 text-sm text-ink-dim">{t.backendDown}</p>
      </section>
    )
  }

  const wind = num(conditions.wind_speed)
  const wave = num(conditions.wave_height)
  const isOptimal = String(conditions.sst_range || '').toLowerCase().includes('optimal')

  return (
    <section className={cx('border-b border-hairline p-4', className)} aria-label={t.conditionsTitle}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-ink">
          {t.conditionsTitle}
        </h2>
        {conditions.location && (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-ink-dim">
            {conditions.location}
          </span>
        )}
      </div>

      {/* Primary readout: SST */}
      <div className="mt-3 rounded-xl border border-hairline bg-surface-1/50 p-3">
        <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.16em] text-ink-dim">
          <Thermometer size={11} className="text-accent" />
          {t.metricSst}
        </div>
        <div className="mt-1 flex items-end gap-2">
          <span className="font-mono text-4xl font-bold leading-none text-ink">
            {conditions.sst}
          </span>
          {conditions.sst_range && (
            <span
              className={cx(
                'mb-1 text-[10px]',
                isOptimal ? 'text-status-safe' : 'text-ink-dim',
              )}
            >
              {conditions.sst_range}
            </span>
          )}
        </div>
      </div>

      {/* Secondary readouts */}
      <div className="mt-2 grid grid-cols-3 gap-2">
        <Readout
          icon={Wind}
          label={t.metricWind}
          value={conditions.wind_speed}
          gauge={
            <Gauge
              value={wind}
              max={45}
              tone={wind >= 30 ? '#FF5C5C' : wind >= 20 ? '#F5B942' : '#22B8FF'}
            />
          }
        />
        <Readout
          icon={WavesIcon}
          label={t.metricWave}
          value={conditions.wave_height}
          gauge={
            <Gauge
              value={wave}
              max={5}
              tone={wave >= 3 ? '#FF5C5C' : wave >= 2 ? '#F5B942' : '#22B8FF'}
            />
          }
        />
        <Readout icon={Droplets} label={t.metricChl} value={conditions.chlorophyll} />
      </div>

      {/* Advisory + provenance */}
      {conditions.craft_advisory && (
        <p
          className={cx(
            'mt-3 rounded-lg border border-hairline bg-surface-1/40 px-2.5 py-2 text-xs',
            STATUS_TEXT[safetyStatus] || 'text-ink',
          )}
        >
          {conditions.craft_advisory}
        </p>
      )}
      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-ink-dim">
        {conditions.source ? `${t.source}: ${conditions.source}` : ''}
        {conditions.updated ? ` · ${t.asOf} ${conditions.updated}` : ''}
      </p>
    </section>
  )
}
