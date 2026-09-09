import { cx } from '../lib/format'
import { SIGNAL } from '../lib/chartColors'

const COLOR = {
  live: SIGNAL.safe,
  offline: SIGNAL.danger,
  connecting: SIGNAL.caution,
}

/** Small pulsing system-status indicator. status: 'live' | 'offline' | 'connecting' */
export default function StatusDot({ status = 'connecting', className = '' }) {
  const c = COLOR[status] || COLOR.connecting
  return (
    <span className={cx('relative grid h-2.5 w-2.5 shrink-0 place-items-center', className)}>
      <span
        className={cx('absolute inset-0 rounded-full', status === 'live' && 'animate-pulse-soft')}
        style={{ background: c, opacity: status === 'live' ? undefined : 0.28 }}
      />
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
    </span>
  )
}
