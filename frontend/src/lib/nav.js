import { Radar, Map, Radio, Bell, FileText, Settings } from 'lucide-react'

// Shared navigation model for the sidebar (desktop) and bottom nav (mobile).
export const NAV_ITEMS = [
  { id: 'home', icon: Radar, labelKey: 'navHome' },
  { id: 'map', icon: Map, labelKey: 'navMap' },
  { id: 'ask', icon: Radio, labelKey: 'navAsk' },
  { id: 'alerts', icon: Bell, labelKey: 'navAlerts' },
  { id: 'reports', icon: FileText, labelKey: 'navReports' },
  { id: 'settings', icon: Settings, labelKey: 'navSettings' },
]
