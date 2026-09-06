import { Radar, Map, Radio, Bell, Menu } from 'lucide-react'
import { cx } from '../lib/format'

// Compact 5-slot bottom navigation for phones. "Ask ORCA" is the raised
// primary action in the centre.
const ITEMS = [
  { id: 'home', icon: Radar, labelKey: 'navHome' },
  { id: 'map', icon: Map, labelKey: 'navMap' },
  { id: 'ask', icon: Radio, labelKey: 'navAsk', primary: true },
  { id: 'alerts', icon: Bell, labelKey: 'navAlerts' },
  { id: 'more', icon: Menu, labelKey: 'navSettings' },
]

export default function MobileNav({ activeNav, onNav, alertCount = 0, t }) {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-[800] flex items-end justify-around border-t border-hairline bg-ocean-850/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur lg:hidden"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon
        const active = activeNav === item.id || (item.id === 'more' && activeNav === 'settings')
        if (item.primary) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNav('ask')}
              aria-label={t[item.labelKey]}
              className="-mt-6 grid h-14 w-14 place-items-center rounded-2xl border border-accent-bright/40 bg-accent text-ocean-900 shadow-[0_0_24px_rgba(54,207,255,0.5)] active:scale-95"
            >
              <Icon size={24} strokeWidth={2} />
            </button>
          )
        }
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNav(item.id)}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'relative flex min-w-[56px] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors',
              active ? 'text-accent' : 'text-ink-dim',
            )}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span className="tracking-wide">{t[item.labelKey]}</span>
            {item.id === 'alerts' && alertCount > 0 && (
              <span className="absolute right-1 top-0 grid h-4 min-w-[16px] place-items-center rounded-full bg-status-danger px-1 text-[9px] font-bold text-ocean-900">
                {alertCount}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
