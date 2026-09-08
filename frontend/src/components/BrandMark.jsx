import Sonar from './Sonar'
import { cx } from '../lib/format'

/** ORCA wordmark + sonar glyph. */
export default function BrandMark({ descriptor, compact = false, className = '' }) {
  return (
    <div className={cx('flex items-center gap-2.5', className)}>
      <Sonar size={compact ? 24 : 30} active={false} />
      <div className="leading-none">
        <div className="font-display text-heading font-bold tracking-[0.18em] text-ink">ORCA</div>
        {!compact && descriptor && (
          <div className="mt-1 font-mono text-meta uppercase text-ink-dim">{descriptor}</div>
        )}
      </div>
    </div>
  )
}
