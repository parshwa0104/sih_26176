import { useEffect, useRef, useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { LANG_CODES } from '../translations'
import { cx } from '../lib/format'

const FULL = {
  EN: 'English',
  हि: 'हिन्दी',
  मरा: 'मराठी',
  த: 'தமிழ்',
  മ: 'മലയാളം',
  తె: 'తెలుగు',
  বা: 'বাংলা',
}

export default function LanguageMenu({ lang, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-1/60 px-2.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-hairline-strong"
      >
        <Globe size={14} className="text-accent" />
        <span className="min-w-[20px] text-center">{lang}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-hairline-strong bg-surface-1 py-1 shadow-inst"
        >
          {LANG_CODES.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === lang}
                onClick={() => {
                  onChange(code)
                  setOpen(false)
                }}
                className={cx(
                  'flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-white/5',
                  code === lang ? 'text-accent' : 'text-ink-dim',
                )}
              >
                <span>
                  <span className="font-semibold text-ink">{code}</span>
                  <span className="ml-2 text-xs text-ink-dim">{FULL[code]}</span>
                </span>
                {code === lang && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
