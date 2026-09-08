import { CORE_POSITION } from './investigationLayout.js'
import { PHASES } from './useInvestigation.js'
import './DataFlowLines.css'

const toneColor = {
  cyan: '#2dd4f5',
  teal: '#14b8a6',
  success: '#2bd08a',
  blue: '#3b82f6',
}

export default function DataFlowLines({ agents, positions, agentStatus, activeAgentIndex, phase }) {
  const converging = phase === PHASES.CONVERGING
  const synthesis = phase === PHASES.SYNTHESIS

  return (
    <div className="flow-layer">
      <svg className="flow-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {agents.map((agent, i) => {
          const pos = positions[agent.id]
          const status = agentStatus[agent.id]
          const isActive = i === activeAgentIndex || converging
          const color = toneColor[agent.tone]

          return (
            <line
              key={agent.id}
              x1={pos.x} y1={pos.y}
              x2={CORE_POSITION.x} y2={CORE_POSITION.y}
              className={
                synthesis ? 'flow-line fading'
                  : isActive ? 'flow-line active'
                  : status === 'complete' ? 'flow-line done'
                  : 'flow-line'
              }
              stroke={color}
            />
          )
        })}
      </svg>

      {agents.map((agent, i) => {
        const pos = positions[agent.id]
        const status = agentStatus[agent.id]
        const showParticles = (i === activeAgentIndex || converging) && !synthesis

        if (!showParticles) return null

        const color = toneColor[agent.tone]
        const dur = converging ? '0.7s' : '1.3s'
        const style = {
          '--x1': `${pos.x}%`,
          '--y1': `${pos.y}%`,
          '--x2': `${CORE_POSITION.x}%`,
          '--y2': `${CORE_POSITION.y}%`,
          '--dot-color': color,
          '--dur': dur,
        }

        return (
          <div key={agent.id} className="flow-particles" style={style}>
            <span className="flow-particle" style={{ animationDelay: '0s' }} />
            <span className="flow-particle" style={{ animationDelay: '0.35s' }} />
            {converging && <span className="flow-particle" style={{ animationDelay: '0.55s' }} />}
          </div>
        )
      })}
    </div>
  )
}
