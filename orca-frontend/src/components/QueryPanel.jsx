import { useState, useRef, useEffect } from 'react'
import { Sparkles, ArrowRight, Loader2, Check, ChevronDown, Globe } from 'lucide-react'
import { exampleQueries } from '../data/mockData.js'
import { PHASES } from '../hooks/useInvestigation.js'
import './QueryPanel.css'

const phaseLabel = {
  [PHASES.ACTIVATING]: 'Waking the reasoning core…',
  [PHASES.AGENTS]: 'Coordinating specialised agents…',
  [PHASES.CONVERGING]: 'Converging evidence…',
  [PHASES.SYNTHESIS]: 'Investigation complete',
}

const LANGS = [
  { code: 'EN', label: 'English' },
  { code: 'हिन्दी', label: 'Hindi' },
  { code: 'मराठी', label: 'Marathi' },
  { code: 'தமிழ்', label: 'Tamil' },
]

export default function QueryPanel({ phase, isInvestigating, onStart, onReset }) {
  const [value, setValue] = useState('')
  const [lang, setLang] = useState(LANGS[0])
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  // Close the language dropdown when clicking outside it
  useEffect(() => {
    if (!langOpen) return
    const onDoc = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [langOpen])

  const submit = (text) => {
    const q = (text ?? value).trim()
    if (!q || isInvestigating) return
    onStart(q)
  }

  return (
    <div className="query-panel glass-panel">
      <div className="query-panel-head">
        <span className="query-panel-icon">
          <Sparkles size={15} strokeWidth={2.2} />
        </span>
        <p className="query-panel-label">Ask ORCA</p>

        <div className="query-lang" ref={langRef}>
          <button
            type="button"
            className="query-lang-btn"
            onClick={() => setLangOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            title="Multilingual demo — no live translation"
          >
            <Globe size={12} strokeWidth={2.1} />
            {lang.code}
            <ChevronDown size={11} strokeWidth={2.2} className={langOpen ? 'lang-chev open' : 'lang-chev'} />
          </button>

          {langOpen && (
            <div className="query-lang-menu glass-panel" role="listbox">
              {LANGS.map((l) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={l.code === lang.code}
                  key={l.code}
                  className={l.code === lang.code ? 'query-lang-item active' : 'query-lang-item'}
                  onClick={() => { setLang(l); setLangOpen(false) }}
                >
                  <span className="query-lang-code">{l.code}</span>
                  <span className="query-lang-name">{l.label}</span>
                  {l.code === lang.code && <Check size={12} strokeWidth={2.6} className="lang-check" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {isInvestigating && (
          <span className="query-panel-phase">
            <Loader2 size={13} className="spin" />
            {phaseLabel[phase]}
          </span>
        )}
        {phase === PHASES.SYNTHESIS && (
          <button className="query-panel-reset" onClick={onReset}>New investigation</button>
        )}
      </div>

      <form
        className="query-panel-input-row"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <input
          type="text"
          value={value}
          disabled={isInvestigating}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Why is fishing activity changing near the Ratnagiri coast?"
        />
        <button type="submit" disabled={isInvestigating || !value.trim()} aria-label="Ask ORCA">
          <ArrowRight size={17} strokeWidth={2.3} />
        </button>
      </form>

      {!isInvestigating && (
        <div className="query-panel-chips">
          {exampleQueries.map((q) => (
            <button key={q} className="query-chip" onClick={() => { setValue(q); submit(q) }}>
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
