import { Sparkles } from 'lucide-react'
import { agents } from './mockData.js'
import { AGENT_POSITIONS } from './investigationLayout.js'
import { PHASES } from './useInvestigation.js'
import OrcaCore from './OrcaCore.jsx'
import AgentNode from './AgentNode.jsx'
import DataFlowLines from './DataFlowLines.jsx'
import './InvestigationView.css'

const coreStateByPhase = {
  [PHASES.ACTIVATING]: 'waking',
  [PHASES.AGENTS]: 'active',
  [PHASES.CONVERGING]: 'converging',
  [PHASES.SYNTHESIS]: 'synthesis',
}

export default function InvestigationView({ investigation }) {
  const { phase, query, agentStatus, activeAgentIndex, timeline } = investigation
  const showRunline = phase === PHASES.AGENTS || phase === PHASES.CONVERGING

  return (
    <div className="investigation-view">
      <div className="investigation-query">
        <Sparkles size={13} strokeWidth={2.2} />
        <span>{query}</span>
      </div>

      {showRunline && (
        <div className="iv-run">
          {phase === PHASES.CONVERGING && (
            <span className="iv-converge-chip">
              Cross-Agent Correlation · 4 Agents · 6 Signals
            </span>
          )}
          <div className="iv-runline">
            {timeline.slice(-4).map((e, i) => (
              <span key={i} className="iv-runline-item">
                <span className="iv-runline-label">{e.label}</span>
                <time>{e.at}</time>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={showSynthesis ? 'investigation-canvas dimmed' : 'investigation-canvas'}>
        <DataFlowLines
          agents={agents}
          positions={AGENT_POSITIONS}
          agentStatus={agentStatus}
          activeAgentIndex={activeAgentIndex}
          phase={phase}
        />

        <OrcaCore state={coreStateByPhase[phase] ?? 'idle'} />

        {agents.map((agent) => (
          <AgentNode
            key={agent.id}
            agent={agent}
            position={AGENT_POSITIONS[agent.id]}
            status={agentStatus[agent.id]}
            side={AGENT_POSITIONS[agent.id].x < 50 ? 'left' : 'right'}
            showFinding={phase === PHASES.AGENTS || phase === PHASES.CONVERGING}
          />
        ))}
      </div>
    </div>
  )
}
