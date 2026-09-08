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
        <div className="flex items-center justify-between border-b border-hairline px-panel py-stack">
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
        <div className="max-h-[70vh] overflow-y-auto p-panel">{children}</div>
      </div>
    </div>
  )
}
