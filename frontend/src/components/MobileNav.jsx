import { MoreHorizontal } from 'lucide-react'
import { NAV_ITEMS, isNavActive } from '../lib/nav'
import { cx } from '../lib/format'

// Flat bottom bar for phones. Items come from the shared NAV_ITEMS model so
// this bar and the desktop rail can't drift apart. "More" opens a sheet with
// the 'more'-slot items (Reports, Settings).
const barItems = NAV_ITEMS.filter((i) => i.slot === 'bar')
const hasMore = NAV_ITEMS.some((i) => i.slot === 'more')

function BarButton({ item, active, alertCount, t, onNav }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={() => onNav(item.id)}
      aria-current={item.kind === 'view' && active ? 'page' : undefined}
      aria-pressed={item.kind === 'toggle' ? active : undefined}
      className={cx(
        'relative flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-label transition-colors',
        active ? 'text-accent' : 'text-ink-dim',
      )}
    >
      <Icon size={20} strokeWidth={1.75} />
      <span>{t[item.labelKey]}</span>
      {item.id === 'alerts' && alertCount > 0 && (
        <span className="absolute right-1/4 top-0 grid h-4 min-w-[16px] place-items-center rounded-full bg-status-danger px-1 text-meta font-bold text-white">
          {alertCount}
        </span>
      )}
    </button>
  )
}

export default function MobileNav({ navState, onNav, alertCount = 0, t }) {
  const moreActive = navState.mobileSheet === 'more' || !!navState.modal

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-[800] flex items-stretch justify-around border-t border-hairline bg-ocean-850/95 px-1.5 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur lg:hidden"
    >
      {barItems.map((item) => (
        <BarButton
          key={item.id}
          item={item}
          active={isNavActive(item, navState)}
          alertCount={alertCount}
          t={t}
          onNav={onNav}
        />
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={() => onNav('more')}
          aria-haspopup="menu"
          aria-expanded={moreActive}
          className={cx(
            'flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-label transition-colors',
            moreActive ? 'text-accent' : 'text-ink-dim',
          )}
        >
          <MoreHorizontal size={20} strokeWidth={1.75} />
          <span>{t.navMore || 'More'}</span>
        </button>
      )}
    </nav>
  )
}
