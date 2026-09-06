import { useEffect, useState } from 'react'
import OceanBackdrop, { OrcaMark } from './OceanBackdrop.jsx'
import EntryMarineLife from './EntryMarineLife.jsx'

// Cinematic ORCA activation (~1.15s) — pure frontend prototype.
export default function OrcaEntryTransition({ onComplete }) {
  const [step, setStep] = useState('auth') // auth -> granted -> done

  useEffect(() => {
    const t1 = setTimeout(() => setStep('granted'), 620)
    const t2 = setTimeout(() => setStep('done'), 1000)
    const t3 = setTimeout(onComplete, 1180)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div className="auth-page entry-page">
      <OceanBackdrop />
      <EntryMarineLife />
      <div className={`entry-core step-${step}`}>
        <span className="entry-ring ring-a" />
        <span className="entry-ring ring-b" />
        <span className="entry-glow" />
        <div className="entry-body">
          <OrcaMark size={40} />
        </div>
      </div>

      <div className="entry-readout">
        {step === 'auth' && <span className="entry-status">Authenticating…</span>}
        {step !== 'auth' && <span className="entry-status granted">Access Granted</span>}
        <span className="entry-tagline">Marine Intelligence System</span>
      </div>

      <div className="entry-sweep" aria-hidden="true" />
    </div>
  )
}
