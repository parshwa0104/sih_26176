import { useState } from 'react'
import { Search, Bell, ChevronDown, Menu } from 'lucide-react'
import { currentUser } from '../data/mockData.js'
import './Header.css'

function OrcaMark() {
  return (
    <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true">
      <defs>
        <linearGradient id="orcaMarkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7fe6fa" />
          <stop offset="100%" stopColor="#2dd4f5" />
        </linearGradient>
      </defs>
      <path
        d="M4 24c4-11 13-18 24-16 4 0.7 7 3 8 5-3-1-6-1-8 0 3 2 4 5 3 8-1 3-4 5-7 5-1.6 3-5 6-9 6-6 0-11-4-13-9-2 0.4-4-0.2 2 1z"
        fill="url(#orcaMarkGrad)"
      />
      <circle cx="27" cy="16.5" r="1.4" fill="#04121f" />
    </svg>
  )
}

export default function Header({ onToggleSidebar, sidebarOpen }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <button
        type="button"
        className="header-sidebar-toggle"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? 'Hide navigation' : 'Show navigation'}
        aria-expanded={sidebarOpen}
        title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        <Menu size={18} strokeWidth={2.1} />
      </button>

      <div className="header-brand">
        <OrcaMark />
        <div className="header-brand-text">
          <span className="header-wordmark">ORCA</span>
        </div>
        <span className="header-divider" aria-hidden="true" />
        <p className="header-tagline">
          Marine EcoSystem Reasoning<br />with Collaborative Agents
        </p>
      </div>

      <div className="header-search">
        <Search size={16} strokeWidth={2} />
        <input type="text" placeholder="Search location, species, data..." aria-label="Search" />
      </div>

      <div className="header-actions">
        <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={18} strokeWidth={2} />
          <span className="header-icon-dot" />
        </button>

        <button className="header-user" onClick={() => setMenuOpen((v) => !v)}>
          <span className="header-avatar">{currentUser.initials}</span>
          <span className="header-user-text">
            <span className="header-user-name">{currentUser.name}</span>
            <span className="header-user-role">{currentUser.role}</span>
          </span>
          <ChevronDown size={16} strokeWidth={2} className={menuOpen ? 'chev open' : 'chev'} />
        </button>

        {menuOpen && (
          <div className="header-menu glass-panel">
            <button>Profile</button>
            <button>Preferences</button>
            <button>Sign out</button>
          </div>
        )}
      </div>
    </header>
  )
}
