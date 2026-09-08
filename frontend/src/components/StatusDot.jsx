import { cx } from '../lib/format'

const COLOR = {
  live: '#2EE6A6',
  offline: '#FF5C5C',
  connecting: '#F5B942',
}

/** Small pulsing system-status indicator. status: 'live' | 'offline' | 'connecting' */
export default function StatusDot({ status = 'connecting', className = '' }) {
  const c = COLOR[status] || COLOR.connecting
  return (
    <span className={cx('relative grid h-2.5 w-2.5 shrink-0 place-items-center', className)}>
      <span className="absolute inset-0 rounded-full" style={{ background: c, opacity: 0.28 }} />
      {status === 'live' && (
        <span
          className="absolute inset-0 rounded-full animate-orca-ping"
          style={{ border: `1px solid ${c}` }}
        />
      )}
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
    </span>
  )
}
