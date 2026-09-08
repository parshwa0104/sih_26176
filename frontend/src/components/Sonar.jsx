import { cx } from '../lib/format'
import { ACCENT } from '../lib/chartColors'

/**
 * ORCA's signature motif: a sonar scope. Concentric range rings + a rotating
 * sweep + an expanding contact ping. Used for the AI processing state and,
 * with `active={false}`, as the static brand glyph.
 */
export default function Sonar({ size = 96, active = true, label, className = '' }) {
  return (
    <div
      className={cx('relative grid shrink-0 place-items-center', className)}
      style={{ width: size, height: size }}
      role={label ? 'status' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <span className="absolute inset-0 rounded-full border border-accent/25" />
      <span className="absolute inset-[22%] rounded-full border border-accent/20" />
      <span className="absolute inset-[44%] rounded-full border border-accent/15" />
      {/* crosshair ticks */}
      <span className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 bg-accent/30" />
      <span className="absolute left-1/2 bottom-0 h-1.5 w-px -translate-x-1/2 bg-accent/30" />
      <span className="absolute top-1/2 left-0 w-1.5 h-px -translate-y-1/2 bg-accent/30" />
      <span className="absolute top-1/2 right-0 w-1.5 h-px -translate-y-1/2 bg-accent/30" />

      {active && (
        <span
          className="absolute inset-0 rounded-full animate-orca-sweep"
          style={{
            background: `conic-gradient(from 0deg, ${ACCENT}00 0deg, ${ACCENT}4D 50deg, ${ACCENT}00 110deg)`,
          }}
        />
      )}
      {active && <span className="absolute h-2.5 w-2.5 rounded-full bg-accent animate-orca-ping" />}
      <span
        className="relative h-1.5 w-1.5 rounded-full bg-accent-bright"
        style={{ boxShadow: `0 0 10px 2px ${ACCENT}99` }}
      />
    </div>
  )
}
