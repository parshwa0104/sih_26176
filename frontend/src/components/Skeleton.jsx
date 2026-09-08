import { cx } from '../lib/format'

/** Loading placeholder block. */
export default function Skeleton({ className = '' }) {
  return <div className={cx('animate-pulse rounded bg-black/[0.06]', className)} aria-hidden="true" />
}
