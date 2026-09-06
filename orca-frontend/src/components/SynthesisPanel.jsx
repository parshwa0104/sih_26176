import { useState } from 'react'
import { Waves, Fish, Sprout, Ship, MapPin, RotateCcw, ShieldCheck, ChevronDown, CornerDownRight } from 'lucide-react'
import { demoMode } from '../data/mockData.js'
import './SynthesisPanel.css'

const icons = { Waves, Fish, Sprout, Ship }

function simulateFollowUp(q) {
  const low = q.toLowerCase()
  if (/(factor|most|dominant|contribute)/.test(low)) {
    return 'The dominant correlated driver is the sustained SST anomaly (+1.3°C), which overlaps the decline in pelagic catch and the elevated vessel concentration along the Maharashtra coast.'
  }
  if (/(reef|coral|bleach)/.test(low)) {
    return 'Reef thermal stress is elevated but has not crossed acute bleaching thresholds — it is a secondary amplifier rather than the primary driver in this investigation.'
  }
  return 'The same evidence chain applies: SST anomaly and elevated fishing pressure are the leading correlated signals, with vessel concentration as a contributing overlap.'
}

export default function SynthesisPanel({ result, agents, onReset }) {
  const [whyOpen, setWhyOpen] = useState(false)
  const [followups, setFollowups] = useState([])
  const [followVal, setFollowVal] = useState('')

  const agentIcon = (id) => {
    const a = agents.find((x) => x.id === id)
    return a ? icons[a.icon] : Waves
  }
  const agentTone = (id) => {
    const a = agents.find((x) => x.id === id)
    return a ? a.tone : 'cyan'
  }

  const submitFollow = () => {
    const q = followVal.trim()
    if (!q) return
    setFollowups((prev) => [...prev, { q, a: simulateFollowUp(q) }])
    setFollowVal('')
  }

  return (
    <div className="synthesis-panel">
      <div className="synthesis-card glass-panel">
        <div className="synthesis-head">
          <span className="synthesis-badge">
            <ShieldCheck size={13} strokeWidth={2.2} />
            ORCA Synthesis
          </span>
          <span className="synthesis-confidence">{result.confidence}% confidence</span>
        </div>

        <p className="synthesis-headline">{result.headline}</p>

        <div className="synthesis-confidence-bar">
          <span style={{ width: `${result.confidence}%` }} />
        </div>

        <div className="syn-kpis">
          <span className="syn-kpi">
            <MapPin size={12} strokeWidth={2.1} />
            <em>Region</em>
            {result.region}
          </span>
          <span className="syn-kpi">
            <em>Evidence</em>
            {result.contributingAgents.length} agents
          </span>
          <span className="syn-kpi">
            <em>Signals</em>
            {result.signals ?? 6}
          </span>
        </div>

        <p className="synthesis-evidence-title">Supporting evidence</p>
        <div className="syn-agent-evidence">
          {(result.agents ?? []).map((e) => {
            const Icon = agentIcon(e.id)
            return (
              <div key={e.id} className={`syn-evidence-row tone-${agentTone(e.id)}`}>
                <span className="syn-evidence-icon"><Icon size={13} strokeWidth={2.1} /></span>
                <span className="syn-evidence-body">
                  <span className="syn-evidence-category">{e.category}</span>
                  <span className="syn-evidence-text">{e.text}</span>
                </span>
              </div>
            )
          })}
        </div>

        <button className="syn-why-toggle" onClick={() => setWhyOpen((v) => !v)} aria-expanded={whyOpen}>
          <span>Why this conclusion?</span>
          <ChevronDown size={14} strokeWidth={2.2} className={whyOpen ? 'chev open' : 'chev'} />
        </button>

        {whyOpen && (
          <div className="syn-why">
            <ol>
              {(result.agents ?? []).map((e, i) => (
                <li key={e.id}>
                  <span className="syn-why-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="syn-why-body">
                    <span className="syn-why-title">{e.category.toUpperCase()} EVIDENCE</span>
                    <span className="syn-why-text">{e.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="syn-overall">
              Overall confidence <b>{result.confidence}%</b> · correlated across {result.contributingAgents.length} agents
            </div>
          </div>
        )}

        <p className="synthesis-evidence-title">Data sources</p>
        <div className="syn-sources">
          {(result.sources ?? []).map((s) => (
            <span key={s.name} className="syn-source">
              <b>{s.name}</b>
              <em>{s.desc}</em>
            </span>
          ))}
        </div>
        {demoMode && <p className="syn-demo">Demo environment · simulated observations</p>}

        <div className="syn-followup">
          <span className="syn-follow-label"><CornerDownRight size={12} strokeWidth={2.2} /> Ask a follow-up</span>
          {followups.map((f, i) => (
            <div key={i} className="syn-follow-block">
              <p className="syn-follow-q">Q: {f.q}</p>
              <p className="syn-follow-a">ORCA: {f.a}</p>
            </div>
          ))}
          <div className="syn-follow-row">
            <input
              type="text"
              value={followVal}
              onChange={(e) => setFollowVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitFollow() }}
              placeholder="e.g. Which factor contributes most?"
            />
            <button onClick={submitFollow} disabled={!followVal.trim()}>Ask</button>
          </div>
        </div>

        <button className="synthesis-reset" onClick={onReset}>
          <RotateCcw size={13} strokeWidth={2.2} />
          Start a new investigation
        </button>
      </div>
    </div>
  )
}
