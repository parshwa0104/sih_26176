import { useEffect } from 'react'
import { X } from 'lucide-react'

/** Centred dialog with backdrop + Esc handling. */
export default function Modal({ title, onClose, closeLabel = 'Close', children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[950] grid place-items-center p-4">
      <div className="absolute inset-0 bg-ocean-900/75 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md animate-fade-up overflow-hidden rounded-2xl border border-hairline-strong bg-ocean-850 shadow-inst"
      >
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-dim hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}
