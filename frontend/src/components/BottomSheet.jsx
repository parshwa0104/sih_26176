import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cx } from '../lib/format'

/** Mobile bottom sheet used for response / zone / conditions / insights / alerts. */
export default function BottomSheet({ open, title, onClose, closeLabel = 'Close', children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      className={cx(
        'fixed inset-0 z-[900] lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <div
        className={cx(
          'absolute inset-0 bg-ocean-900/70 transition-opacity duration-300 ease-instr',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          'absolute inset-x-0 bottom-0 max-h-[82dvh] overflow-y-auto rounded-t-2xl border-t border-hairline-strong bg-ocean-850 pb-[max(env(safe-area-inset-bottom),16px)] transition-transform duration-300 ease-instr',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="flex justify-center pt-2.5">
          <span className="h-1 w-10 rounded-full bg-black/15" />
        </div>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-ocean-850/95 px-panel py-stack backdrop-blur">
          <h2 className="font-display text-label uppercase text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-1.5 grid h-10 w-10 place-items-center rounded-lg text-ink-dim hover:bg-black/5"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-panel">{children}</div>
      </div>
    </div>
  )
}
