import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle } from 'lucide-react'
import Skeleton from './Skeleton'
import { cx } from '../lib/format'
import { SIGNAL } from '../lib/chartColors'

const CONF = {
  safe: {
    wordKey: 'safe',
    color: SIGNAL.safe,
    Icon: ShieldCheck,
    grad: 'from-status-safe/12',
  },
  caution: {
    wordKey: 'caution',
    color: SIGNAL.caution,
    Icon: AlertTriangle,
    grad: 'from-status-caution/12',
  },
  danger: {
    wordKey: 'danger',
    color: SIGNAL.danger,
    Icon: ShieldAlert,
    grad: 'from-status-danger/16',
    pulse: true,
  },
  unknown: {
    wordKey: 'safetyUnknown',
    color: SIGNAL.unknown,
    Icon: HelpCircle,
    grad: 'from-black/5',
  },
}

/**
 * Primary safety readout. Prominent, glanceable, but not obnoxious: a tinted
 * gradient wash + a coloured status light rather than a full saturated bar.
 */
export default function SafetyBanner({ status, locationLabel, advisory, updated, loading, t }) {
  if (loading) {
    return (
      <div className="flex h-16 shrink-0 items-center gap-4 border-b border-hairline bg-ocean-850/60 px-4 lg:px-6">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-5 w-52" />
        <Skeleton className="ml-auto hidden h-4 w-40 md:block" />
      </div>
    )
  }

  const c = CONF[status] || CONF.unknown
  const { Icon } = c
  const word = t[c.wordKey] || c.wordKey

  return (
    <div
      role="status"
      aria-label={`${word} ${locationLabel ? `${t.near} ${locationLabel}` : ''}`}
      className={cx(
        'relative flex shrink-0 items-center gap-3 border-b border-hairline bg-gradient-to-r to-transparent px-4 py-2.5 lg:gap-4 lg:px-6 lg:py-3 [@media(max-height:480px)]:py-1.5',
        c.grad,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: c.color }}
      />

      {/* Status light */}
      <span className="relative grid h-9 w-9 shrink-0 place-items-center lg:h-10 lg:w-10">
        <span
          className="absolute inset-0 rounded-full opacity-20"
          style={{ background: c.color }}
        />
        {c.pulse && (
          <span
            className="absolute inset-0 rounded-full animate-orca-ping"
            style={{ border: `1.5px solid ${c.color}` }}
          />
        )}
        <Icon size={22} style={{ color: c.color }} strokeWidth={2} />
      </span>

      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            className="font-display text-readout font-bold uppercase leading-none tracking-[0.04em] lg:text-readout-lg"
            style={{ color: c.color }}
          >
            {word}
          </span>
          {locationLabel && (
            <span className="truncate text-caption text-ink-dim lg:text-body">
              {t.near} <span className="font-semibold text-ink">{locationLabel}</span>
            </span>
          )}
        </div>
        {advisory && (
          <p className="mt-0.5 truncate text-caption text-ink-dim [@media(max-height:480px)]:hidden">
            {advisory}
          </p>
        )}
      </div>

      {updated && (
        <div className="ml-auto hidden shrink-0 text-right font-mono text-meta text-ink-dim md:block [@media(max-height:480px)]:hidden">
          <span className="block">{t.lastUpdate}</span>
          <span className="text-ink">{updated}</span>
        </div>
      )}
    </div>
  )
}
