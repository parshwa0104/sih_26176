import { Radar, Map, Bell, FileText, Settings } from 'lucide-react'

// Single source of truth for both the desktop rail and the mobile bottom bar.
//
// kind — how the item behaves, which drives its ARIA and highlight rules:
//   'view'   persistent view state; owns the "current" highlight   (aria-current)
//   'toggle' flips a layout mode in place                          (aria-pressed)
//   'action' transient — focuses or reveals something, no destination
//   'dialog' opens a modal / sheet                                 (aria-haspopup)
//
// slot — where it sits on the mobile bottom bar:
//   'bar'   a normal slot
//   'more'  tucked inside the mobile "More" sheet
//
// Note: there is deliberately no "Ask ORCA" item — the command console is
// permanently docked at the bottom of the screen, so a nav shortcut to it
// would be redundant.
export const NAV_ITEMS = [
  { id: 'home', icon: Radar, labelKey: 'navHome', kind: 'view', slot: 'bar' },
  { id: 'map', icon: Map, labelKey: 'navMap', kind: 'toggle', slot: 'bar' },
  { id: 'alerts', icon: Bell, labelKey: 'navAlerts', kind: 'action', slot: 'bar' },
  { id: 'reports', icon: FileText, labelKey: 'navReports', kind: 'dialog', slot: 'more' },
  { id: 'settings', icon: Settings, labelKey: 'navSettings', kind: 'dialog', slot: 'more' },
]

/**
 * Is a nav item the currently-active one, given the app's UI state?
 * `navState` = { view, modal, mapFocus, mobileSheet }
 */
export function isNavActive(item, navState) {
  switch (item.kind) {
    case 'view':
      return navState.view === item.id && !navState.modal && !navState.mobileSheet
    case 'toggle':
      return item.id === 'map' && navState.mapFocus
    case 'dialog':
      return navState.modal === item.id
    default:
      return false
  }
}
