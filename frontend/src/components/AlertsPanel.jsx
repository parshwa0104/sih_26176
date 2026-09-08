import { AlertTriangle, Info, Clock } from 'lucide-react'
import Skeleton from './Skeleton'
import { cx } from '../lib/format'

const KIND = {
  warning: { bar: 'border-l-status-caution', text: 'text-status-caution', Icon: AlertTriangle },
  danger: { bar: 'border-l-status-danger', text: 'text-status-danger', Icon: AlertTriangle },
  info: { bar: 'border-l-accent', text: 'text-accent', Icon: Info },
}

/** Alerts panel driven by GET /conditions -> alerts[]. */
export default function AlertsPanel({
  alerts = [],
  loading,
  t,
  className = '',
  pulse = false,
  hideHeader = false,
}) {
  return (
    <section
      className={cx(
        'p-block rounded-xl transition-shadow duration-500 ease-instr',
        pulse && 'ring-2 ring-accent/60',
        className,
      )}
      aria-label={t.alertsTitle}
    >
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <h2 className="font-display text-label uppercase text-ink">{t.alertsTitle}</h2>
          {alerts.length > 0 && (
            <span className="rounded-full bg-status-danger/15 px-2 py-0.5 text-meta font-bold text-status-danger">
              {alerts.length}
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="mt-3 space-y-2">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      ) : alerts.length === 0 ? (
        <p className="mt-3 text-body text-ink-dim">{t.noAlerts}</p>
      ) : (
        <ul className="mt-3 animate-fade-up space-y-stack">
          {alerts.map((a, i) => {
            const k = KIND[a.type] || KIND.info
            const Icon = k.Icon
            return (
              <li
                key={i}
                className={cx(
                  'rounded-r-lg border border-l-2 border-hairline bg-surface-1/40 p-stack',
                  k.bar,
                )}
              >
                <div className="flex items-start gap-2">
                  <Icon size={14} className={cx('mt-0.5 shrink-0', k.text)} />
                  <div className="min-w-0">
                    <p className="text-body font-medium leading-snug text-ink">{a.text}</p>
                    {a.time && (
                      <p className="mt-1 flex items-center gap-1 font-mono text-meta uppercase text-ink-dim">
                        <Clock size={9} />
                        {a.time}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
