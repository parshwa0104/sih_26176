import { Bell, ChevronRight } from 'lucide-react'
import { recentAlerts } from '../data/mockData.js'
import './RecentAlerts.css'
import './AIInsights.css'

export default function RecentAlerts() {
  return (
    <div className="side-panel glass-panel">
      <div className="side-panel-head">
        <span className="side-panel-title">
          <Bell size={14} strokeWidth={2.2} />
          Recent Alerts
        </span>
        <button className="side-panel-link">View All <ChevronRight size={13} strokeWidth={2.2} /></button>
      </div>

      <div className="alert-list">
        {recentAlerts.map((alert) => (
          <button className="alert-row" key={alert.id}>
            <span className={`alert-dot sev-${alert.severity}`} />
            <span className="alert-text">
              <span className="alert-title">{alert.title}</span>
              <span className="alert-meta">{alert.meta}</span>
            </span>
            <ChevronRight size={14} strokeWidth={2} className="insight-chev" />
          </button>
        ))}
      </div>
    </div>
  )
}
