import { useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import OceanBackdrop, { OrcaMark } from './OceanBackdrop.jsx'

export default function PhoneLogin({ onNext }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const digits = value.replace(/\D/g, '').slice(0, 10)
  const valid = /^[6-9]\d{9}$/.test(digits)

  const submit = () => {
    if (!valid) {
      setError('Enter a valid 10-digit mobile number (starting 6–9).')
      return
    }
    setError('')
    // Prototype: no SMS is sent — proceed to OTP stage.
    onNext(digits)
  }

  return (
    <div className="auth-page">
      <OceanBackdrop />
      <div className="auth-card glass-panel">
        <div className="auth-brand">
          <OrcaMark />
          <span className="auth-wordmark">ORCA</span>
        </div>
        <p className="auth-kicker">Marine EcoSystem Reasoning</p>

        <h1 className="auth-title">Enter your phone number</h1>
        <p className="auth-sub">Enter your mobile number to continue</p>

        <form
          className="auth-form"
          onSubmit={(e) => { e.preventDefault(); submit() }}
        >
          <div className={error ? 'phone-row invalid' : 'phone-row'}>
            <span className="phone-prefix">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              autoFocus
              aria-label="Phone number"
              placeholder="10-digit mobile number"
              value={digits}
              onChange={(e) => { setValue(e.target.value); setError('') }}
            />
          </div>
          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-primary" disabled={!valid}>
            Get OTP <ArrowRight size={16} strokeWidth={2.3} />
          </button>
        </form>

        <p className="auth-note">
          <ShieldCheck size={12} strokeWidth={2.2} />
          Prototype — no SMS is sent. Any valid number continues.
        </p>
      </div>
    </div>
  )
}
