import { Users, Waves, Fish, Sprout, Ship, Loader2, Check } from 'lucide-react'
import { agents } from '../data/mockData.js'
import './AgentStrip.css'

const icons = { Waves, Fish, Sprout, Ship }

export default function AgentStrip({ agentStatus }) {
  return (
    <div className="agent-strip glass-panel">
      <div className="agent-strip-head">
        <Users size={15} strokeWidth={2.1} />
        <h3>Agent Collaboration</h3>
      </div>

      <div className="agent-strip-grid">
        {agents.map((agent) => {
          const Icon = icons[agent.icon]
          const status = agentStatus[agent.id]
          return (
            <div className={`agent-strip-card tone-${agent.tone} status-${status}`} key={agent.id}>
              <div className="agent-strip-icon">
                <Icon size={17} strokeWidth={2.1} />
              </div>
              <div className="agent-strip-body">
                <span className="agent-strip-name">{agent.name}</span>
                <span className="agent-strip-role">{agent.role}</span>
              </div>
              <span className="agent-strip-status">
                {status === 'analysing' && <Loader2 size={11} className="spin" />}
                {status === 'complete' && <Check size={11} strokeWidth={3} />}
                {status === 'idle' && <span className="dot-idle" />}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
