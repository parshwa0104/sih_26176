import { useState } from 'react'
import { ChevronDown, Cpu, Check, Loader2 } from 'lucide-react'
import { cx } from '../lib/format'

/** Collapsible "How ORCA knows" timeline of the agent reasoning_trail. */
export default function ReasoningTrail({ steps = [], t }) {
  const [open, setOpen] = useState(false)
  if (!Array.isArray(steps) || steps.length === 0) return null

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-ocean-900/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-3 py-2 text-label text-accent"
      >
        <span className="flex items-center gap-field">
          <Cpu size={13} />
          {t.howItKnows}
        </span>
        <ChevronDown size={14} className={cx('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <ol className="relative space-y-3 px-4 pb-3 pt-1">
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-[21px] top-2 w-px bg-hairline"
          />
          {steps.map((s, i) => {
            const done = s.status === 'done'
            return (
              <li key={i} className="relative flex gap-3">
                <span
                  className={cx(
                    'relative z-10 mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border',
                    done
                      ? 'border-status-safe bg-status-safe/20 text-status-safe'
                      : 'border-status-caution bg-status-caution/20 text-status-caution',
                  )}
                >
                  {done ? <Check size={10} /> : <Loader2 size={10} className="animate-spin" />}
                </span>
                <div className="min-w-0">
                  <p className="text-caption font-semibold text-ink">
                    {s.agent}
                    <span className="ml-2 font-mono text-meta font-normal text-ink-dim">
                      {done ? t.stepDone : t.stepRunning}
                    </span>
                  </p>
                  <p className="mt-0.5 text-caption leading-relaxed text-ink-dim">
                    {s.result || s.action}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
