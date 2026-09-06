import { Waves, Thermometer, Leaf, Wind, ChevronRight, ArrowUp } from 'lucide-react'
import { liveConditions } from '../data/mockData.js'
import './LiveConditions.css'
import './AIInsights.css'

const icons = { Thermometer, Leaf, Wind, Waves }

export default function LiveConditions() {
  return (
    <div className="side-panel glass-panel">
      <div className="side-panel-head">
        <span className="side-panel-title">
          <Waves size={14} strokeWidth={2.2} />
          Live Ocean Conditions
        </span>
        <button className="side-panel-link">View Details <ChevronRight size={13} strokeWidth={2.2} /></button>
      </div>

      <div className="condition-grid">
        {liveConditions.map((c) => {
          const Icon = icons[c.icon]
          return (
            <div className={`condition-card tone-${c.tone}`} key={c.id}>
              <span className="condition-icon">
                <Icon size={15} strokeWidth={2.1} />
              </span>
              <span className="condition-label">{c.label}</span>
              <span className="condition-value">{c.value}<small> {c.unit}</small></span>
              <span className="condition-delta">
                <ArrowUp size={10} strokeWidth={2.5} />
                {c.delta}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
