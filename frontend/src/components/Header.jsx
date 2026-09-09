import { useState } from 'react'
import { Bell, Search, User, MapPin } from 'lucide-react'
import BrandMark from './BrandMark'
import LanguageMenu from './LanguageMenu'
import StatusDot from './StatusDot'
import { cx } from '../lib/format'

/** Top operations console: identity · locate · notifications · language · skipper. */
export default function Header({
  t,
  lang,
  onLang,
  alertCount = 0,
  onBell,
  onSearch,
  homePort,
  systemStatus = 'connecting',
}) {
  const [q, setQ] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const v = q.trim()
    if (!v) return
    onSearch?.(v)
    setQ('')
  }

  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center gap-3 border-b border-hairline bg-ocean-850/80 px-3 backdrop-blur lg:h-16 lg:px-5">
      <BrandMark descriptor={t.productName} className="hidden sm:flex" />
      <BrandMark compact className="sm:hidden" />

      {/* Locate: a tool in the flow next to identity, not a centred hero field. */}
      <form onSubmit={submit} className="ml-3 hidden w-[240px] shrink-0 lg:block xl:w-[280px]">
        <div className="flex h-9 items-center gap-field rounded-xl border border-hairline bg-surface-1/50 px-3 focus-within:border-hairline-strong">
          <Search size={15} className="shrink-0 text-ink-dim" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-body text-ink placeholder:text-ink-dim/70 focus:outline-none"
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-field rounded-xl border border-hairline bg-surface-1/50 px-2.5 py-1.5 font-mono text-meta uppercase text-ink-dim md:flex">
          <StatusDot status={systemStatus} />
          <span>{systemStatus === 'live' ? t.systemLive : systemStatus === 'offline' ? t.systemOffline : t.systemConnecting}</span>
        </div>

        <button
          type="button"
          onClick={onBell}
          aria-label={t.alertsTitle}
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-hairline bg-surface-1/50 text-ink-dim transition-colors hover:text-ink"
        >
          <Bell size={17} />
          {alertCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-status-danger px-1 text-meta font-bold text-white">
              {alertCount}
            </span>
          )}
        </button>

        <LanguageMenu lang={lang} onChange={onLang} />

        <div
          className={cx(
            'hidden items-center gap-2 rounded-xl border border-hairline bg-surface-1/50 py-1.5 pl-1.5 pr-3 xl:flex',
          )}
        >
          <span className="grid h-6 w-6 place-items-center rounded-xl bg-accent/15 text-accent">
            <User size={14} />
          </span>
          <span className="leading-none">
            <span className="block text-caption font-semibold text-ink">{t.profile}</span>
            <span className="mt-0.5 flex items-center gap-1 text-meta text-ink-dim">
              <MapPin size={9} />
              {homePort || '-'}
            </span>
          </span>
        </div>
      </div>
    </header>
  )
}
