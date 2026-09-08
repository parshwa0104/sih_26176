import './OrcaCore.css'

// state: 'idle' | 'waking' | 'active' | 'converging' | 'synthesis'
export default function OrcaCore({ state = 'idle' }) {
  return (
    <div className={`orca-core state-${state}`}>
      <span className="core-ring ring-outer" />
      <span className="core-ring ring-mid" />
      <span className="core-glow" />
      <div className="core-body">
        <svg viewBox="0 0 40 40" width="26" height="26" aria-hidden="true">
          <path
            d="M4 24c4-11 13-18 24-16 4 0.7 7 3 8 5-3-1-6-1-8 0 3 2 4 5 3 8-1 3-4 5-7 5-1.6 3-5 6-9 6-6 0-11-4-13-9-2 0.4-4-0.2 2 1z"
            fill="currentColor"
          />
        </svg>
      </div>
      <span className="core-label">ORCA</span>
    </div>
  )
}
