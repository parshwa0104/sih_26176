import { Sparkles, Fish, TriangleAlert, Waves, Wind, ChevronRight } from 'lucide-react'
import { aiInsights } from '../data/mockData.js'
import './AIInsights.css'

const icons = { Fish, TriangleAlert, Waves, Wind }

export default function AIInsights() {
  return (
    <div className="side-panel glass-panel">
      <div className="side-panel-head">
        <span className="side-panel-title">
          <Sparkles size={14} strokeWidth={2.2} />
          AI Insights
        </span>
        <button className="side-panel-link">View All <ChevronRight size={13} strokeWidth={2.2} /></button>
      </div>

      <div className="insight-list">
        {aiInsights.map((insight) => {
          const Icon = icons[insight.icon]
          return (
            <button className="insight-row" key={insight.id}>
              <span className={`insight-icon tone-${insight.tone}`}>
                <Icon size={15} strokeWidth={2.1} />
              </span>
              <span className="insight-text">
                <span className="insight-title">{insight.title}</span>
                <span className="insight-subtitle">{insight.subtitle}</span>
              </span>
              <ChevronRight size={14} strokeWidth={2} className="insight-chev" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
