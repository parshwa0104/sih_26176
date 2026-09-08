import { Waves, Fish, Sprout, Ship, Loader2, Check } from 'lucide-react'
import './AgentNode.css'

const icons = { Waves, Fish, Sprout, Ship }

const statusText = {
  idle: 'Idle',
  analysing: 'Analysing…',
  complete: 'Complete',
}

export default function AgentNode({ agent, position, status, showFinding, side = 'right' }) {
  const Icon = icons[agent.icon]

  return (
    <div
      className={`agent-node tone-${agent.tone} status-${status}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div className="agent-node-ring">
        <div className="agent-node-icon">
          <Icon size={16} strokeWidth={2.1} />
        </div>
      </div>
      <div className="agent-node-info">
        <span className="agent-node-name">{agent.name}</span>
        <span className="agent-node-status">
          {status === 'analysing' && <Loader2 size={10} className="spin" />}
          {status === 'complete' && <Check size={10} strokeWidth={3} />}
          {statusText[status]}
        </span>
      </div>

      {showFinding && status === 'complete' && (
        <div className={`agent-node-finding glass-panel side-${side}`}>{agent.finding}</div>
      )}
    </div>
  )
}
