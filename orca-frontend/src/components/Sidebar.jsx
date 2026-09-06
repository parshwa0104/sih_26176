import { Home, Map, Database, FileText, Bell, Settings } from 'lucide-react'
import { navItems } from '../data/mockData.js'
import './Sidebar.css'

const icons = { Home, Map, Database, FileText, Bell, Settings }

export default function Sidebar({ active, onSelect, collapsed = false }) {
  return (
    <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}>
      <div className="sidebar-inner">
        <nav>
          <ul>
            {navItems.map((item) => {
              const Icon = icons[item.icon]
              const isActive = item.id === active
              return (
                <li key={item.id}>
                  <button
                    className={isActive ? 'sidebar-item active' : 'sidebar-item'}
                    onClick={() => onSelect(item.id)}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-orca-glyph" aria-hidden="true">
            <svg viewBox="0 0 120 160" width="100%" height="100%">
              <defs>
                <linearGradient id="sideGlyph" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4f5" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0a2138" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M10 20c25 10 45 30 55 55s5 55-15 70c25-5 45-25 50-55 5-35-15-70-50-80-15-4-28-2-40 10z"
                fill="url(#sideGlyph)"
              />
            </svg>
          </div>
          <p className="sidebar-footline">Healthier Oceans.<br />Stronger Communities.<br />A Sustainable Tomorrow.</p>
        </div>
      </div>
    </aside>
  )
}
