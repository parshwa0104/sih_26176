import { Waves, Fish, Satellite, Users, ArrowUp } from 'lucide-react'
import { statCards } from '../data/mockData.js'
import './StatCards.css'

const icons = { Waves, Fish, Satellite, Users }

export default function StatCards() {
  return (
    <div className="stat-grid">
      {statCards.map((card) => {
        const Icon = icons[card.icon]
        return (
          <div className="stat-card glass-panel" key={card.id}>
            <div className={`stat-icon tone-${card.tone}`}>
              <Icon size={18} strokeWidth={2.1} />
            </div>
            <div className="stat-body">
              <p className="stat-label">{card.label}</p>
              <div className="stat-value-row">
                <span className="stat-value">{card.value}</span>
                <span className={card.deltaStyle === 'live' ? 'stat-delta live' : 'stat-delta'}>
                  {card.deltaStyle === 'live' ? <span className="live-dot" /> : <ArrowUp size={11} strokeWidth={2.5} />}
                  {card.delta}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
