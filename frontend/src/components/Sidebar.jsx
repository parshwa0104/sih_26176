import Sonar from './Sonar'
import StatusDot from './StatusDot'
import { LogOut } from 'lucide-react'
import { NAV_ITEMS } from '../lib/nav'
import { cx } from '../lib/format'
import { useAuth } from '../contexts/AuthContext'

const STATUS_LABEL = {
  live: 'systemLive',
  offline: 'systemOffline',
  connecting: 'systemConnecting',
}

/** Desktop navigation rail — "navigation equipment", not a SaaS sidebar. */
export default function Sidebar({ activeNav, onNav, systemStatus = 'connecting', alertCount = 0, t }) {
  const { logout } = useAuth()

  return (
    <nav
      aria-label="Primary navigation"
      className="relative z-20 hidden w-[76px] shrink-0 flex-col items-center border-r border-hairline bg-ocean-850/80 py-4 backdrop-blur lg:flex"
    >
      <a
        href="#main"
        className="grid h-11 w-11 place-items-center rounded-xl border border-hairline bg-surface-1/60"
        aria-label="ORCA"
      >
        <Sonar size={26} active={false} />
      </a>

      <ul className="mt-6 flex flex-1 flex-col items-center gap-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = activeNav === item.id
          return (
            <li key={item.id} className="relative">
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute -left-4 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-accent shadow-[0_0_12px_rgba(54,207,255,0.7)]"
                />
              )}
              <button
                type="button"
                onClick={() => onNav(item.id)}
                aria-current={active ? 'page' : undefined}
                title={t[item.labelKey]}
                className={cx(
                  'group relative grid h-12 w-12 place-items-center rounded-xl border transition-colors',
                  active
                    ? 'border-hairline-strong bg-accent/10 text-accent'
                    : 'border-transparent text-ink-dim hover:bg-black/5 hover:text-ink',
                )}
              >
                <Icon size={20} strokeWidth={1.75} />
                <span className="sr-only">{t[item.labelKey]}</span>
                {item.id === 'alerts' && alertCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-status-danger px-1 text-[10px] font-bold text-ocean-900">
                    {alertCount}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto flex flex-col items-center gap-1.5 pt-3">
        <button
          type="button"
          onClick={logout}
          className="group relative grid h-12 w-12 place-items-center rounded-xl border border-transparent text-status-danger transition-colors hover:bg-status-danger/10"
          aria-label="Log Out"
        >
          <LogOut size={20} strokeWidth={1.75} />
        </button>

        <StatusDot status={systemStatus} />
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-dim">
          {t[STATUS_LABEL[systemStatus]] || t.systemConnecting}
        </span>
      </div>
    </nav>
  )
}
