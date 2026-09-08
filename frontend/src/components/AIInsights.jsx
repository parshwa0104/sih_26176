import { Fish, ShieldAlert, Waves as WavesIcon, TrendingUp, Bell, ChevronRight } from 'lucide-react'
import Sonar from './Sonar'
import Skeleton from './Skeleton'
import { cx } from '../lib/format'

const SEV = {
  safe: { bar: 'bg-status-safe', text: 'text-status-safe', Icon: Fish },
  caution: { bar: 'bg-status-caution', text: 'text-status-caution', Icon: WavesIcon },
  danger: { bar: 'bg-status-danger', text: 'text-status-danger', Icon: ShieldAlert },
  accent: { bar: 'bg-accent', text: 'text-accent', Icon: Bell },
}

const ICON_BY_ID = { pfz: Fish, cond: TrendingUp, wind: WavesIcon, safety: ShieldAlert, alert: Bell }

/** AI insights — a scannable list derived from live data, each row actionable. */
export default function AIInsights({ insights = [], loading, onAction, t, className = '' }) {
  return (
    <section className={cx('border-b border-hairline p-4', className)} aria-label={t.insightsTitle}>
      <div className="flex items-center gap-2">
        <Sonar size={16} active={false} />
        <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-ink">
          {t.insightsTitle}
        </h2>
      </div>

      {loading ? (
        <div className="mt-3 space-y-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      ) : insights.length === 0 ? (
        <p className="mt-3 text-sm text-ink-dim">{t.noInsights}</p>
      ) : (
        <ul className="mt-2 divide-y divide-hairline">
          {insights.map((ins) => {
            const sev = SEV[ins.severity] || SEV.accent
            const Icon = ICON_BY_ID[ins.id] || sev.Icon
            return (
              <li key={ins.id} className="flex gap-3 py-3">
                <span className={cx('mt-0.5 w-[3px] shrink-0 rounded-full', sev.bar)} />
                <span className={cx('mt-0.5 shrink-0', sev.text)}>
                  <Icon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{ins.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-dim">{ins.detail}</p>
                  {ins.action && (
                    <button
                      type="button"
                      onClick={() => onAction?.(ins.action)}
                      className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-hairline px-2 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-black/5"
                    >
                      {ins.action.type === 'map' ? t.viewOnMap : t.askAboutThis}
                      <ChevronRight size={11} />
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
