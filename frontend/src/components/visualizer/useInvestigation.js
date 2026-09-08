import { useCallback, useEffect, useRef, useState } from 'react'
import { agents, synthesisResult } from '../data/mockData.js'

// Investigation phases, matching the animation narrative:
// idle -> activating (CORE) -> agents (AGENTS) -> converging (DATA + CONVERGENCE) -> synthesis (SYNTHESIS)
export const PHASES = {
  IDLE: 'idle',
  ACTIVATING: 'activating',
  AGENTS: 'agents',
  CONVERGING: 'converging',
  SYNTHESIS: 'synthesis',
}

const AGENT_DURATION = 1250 // ms each agent spends "analysing"
const AGENT_GAP = 250 // gap before next agent starts

function initialAgentStatus() {
  return Object.fromEntries(agents.map((a) => [a.id, 'idle']))
}

const fmtTime = (d) => d.toLocaleTimeString('en-GB', { hour12: false })

export function useInvestigation() {
  const [phase, setPhase] = useState(PHASES.IDLE)
  const [query, setQuery] = useState('')
  const [agentStatus, setAgentStatus] = useState(initialAgentStatus)
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1)
  const [timeline, setTimeline] = useState([])
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => clearTimers, [])

  const reset = useCallback(() => {
    clearTimers()
    setPhase(PHASES.IDLE)
    setQuery('')
    setAgentStatus(initialAgentStatus())
    setActiveAgentIndex(-1)
    setTimeline([])
  }, [])

  const start = useCallback((submittedQuery) => {
    clearTimers()
    const startedAt = Date.now()
    const logAt = (label, ms) =>
      timers.current.push(
        setTimeout(() => {
          setTimeline((prev) => [...prev, { label, at: fmtTime(new Date(startedAt + ms)) }])
        }, ms)
      )

    setQuery(submittedQuery)
    setAgentStatus(initialAgentStatus())
    setActiveAgentIndex(-1)
    setTimeline([{ label: 'Query received', at: fmtTime(new Date(startedAt)) }])
    setPhase(PHASES.ACTIVATING)

    // CORE activates
    timers.current.push(
      setTimeout(() => {
        setPhase(PHASES.AGENTS)
        logAt('Data retrieval · core online', 900)

        agents.forEach((agent, i) => {
          const startAt = i * (AGENT_DURATION + AGENT_GAP)

          timers.current.push(
            setTimeout(() => {
              setActiveAgentIndex(i)
              setAgentStatus((prev) => ({ ...prev, [agent.id]: 'analysing' }))
              logAt(`${agent.name} investigating`, 900 + startAt)
            }, 900 + startAt)
          )

          timers.current.push(
            setTimeout(() => {
              setAgentStatus((prev) => ({ ...prev, [agent.id]: 'complete' }))
            }, 900 + startAt + AGENT_DURATION)
          )
        })

        const agentsTotal = agents.length * (AGENT_DURATION + AGENT_GAP)

        timers.current.push(
          setTimeout(() => {
            setActiveAgentIndex(-1)
            setPhase(PHASES.CONVERGING)
            logAt('Cross-agent correlation', 900 + agentsTotal + 150)
          }, 900 + agentsTotal + 150)
        )

        timers.current.push(
          setTimeout(() => {
            setPhase(PHASES.SYNTHESIS)
            logAt('Synthesis ready', 900 + agentsTotal + 150 + 1500)
          }, 900 + agentsTotal + 150 + 1500)
        )
      }, 900)
    )
  }, [])

  const isInvestigating = phase !== PHASES.IDLE

  return {
    phase,
    query,
    agentStatus,
    activeAgentIndex,
    isInvestigating,
    timeline,
    result: synthesisResult,
    start,
    reset,
  }
}
