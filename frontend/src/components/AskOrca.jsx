import { forwardRef, useState } from 'react'
import { Send, Mic, Square } from 'lucide-react'
import Sonar from './Sonar'
import { useSpeech } from '../hooks/useSpeech'
import { LANG_SPEECH } from '../translations'
import { cx } from '../lib/format'

/** The ORCA command console. Text + voice, submits POST /query via `onSubmit`. */
const AskOrca = forwardRef(function AskOrca({ onSubmit, loading, lang, t, className = '' }, ref) {
  const [value, setValue] = useState('')

  const { supported, listening, toggle } = useSpeech(LANG_SPEECH[lang] || 'en-IN', (transcript) => {
    setValue(transcript)
    // Note: we intentionally do NOT auto-submit here.
    // The transcript fills the input so the user can review and press Send.
  })

  const submit = (e) => {
    e?.preventDefault?.()
    const q = value.trim()
    if (!q || loading) return
    onSubmit?.(q)
    setValue('')
  }

  return (
    <form
      onSubmit={submit}
      className={cx(
        'rounded-2xl border border-hairline-strong bg-ocean-850/95 p-2 shadow-inst backdrop-blur',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Brand glyph on sm+; on tiny screens it appears only while processing */}
        <div className="hidden h-9 w-9 shrink-0 place-items-center sm:grid">
          <Sonar size={34} active={loading} label={loading ? t.analyzing : undefined} />
        </div>
        {loading && (
          <div className="grid h-9 w-9 shrink-0 place-items-center sm:hidden">
            <Sonar size={30} active label={t.analyzing} />
          </div>
        )}

        <label htmlFor="orca-ask" className="sr-only">
          {t.askTitle}
        </label>
        <input
          id="orca-ask"
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          placeholder={loading ? t.analyzing : t.placeholder}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-1 text-[15px] font-medium text-ink placeholder:text-ink-dim/70 focus:outline-none disabled:opacity-60"
        />

        {supported && (
          <button
            type="button"
            onClick={toggle}
            aria-pressed={listening}
            aria-label={listening ? t.listening : t.askTitle}
            disabled={loading}
            className={cx(
              'grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors',
              listening
                ? 'border-status-danger/50 bg-status-danger/15 text-status-danger animate-pulse'
                : 'border-hairline text-ink-dim hover:bg-black/5 hover:text-ink',
            )}
          >
            {listening ? <Square size={16} /> : <Mic size={18} />}
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !value.trim()}
          aria-label={t.send}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-ocean-900 transition-colors hover:bg-accent-bright disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </div>
      <p
        className={cx(
          'mt-1 truncate px-2 text-[10px] font-mono uppercase tracking-[0.14em] text-ink-dim/70',
          !listening && 'hidden sm:block [@media(max-height:480px)]:hidden',
        )}
      >
        {listening ? t.listening : t.askHint}
      </p>
    </form>
  )
})

export default AskOrca
