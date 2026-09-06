import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import OceanBackdrop, { OrcaMark } from './OceanBackdrop.jsx'

const RESEND_SECONDS = 30

export default function OTPVerification({ phone, onBack, onVerify }) {
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [count, setCount] = useState(RESEND_SECONDS)
  const inputs = useRef([])
  const full = otp.every((d) => d !== '')

  useEffect(() => {
    if (count <= 0) return
    const t = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count])

  const resend = () => {
    setCount(RESEND_SECONDS)
    setOtp(Array(6).fill(''))
    inputs.current[0]?.focus()
  }

  const setDigit = (i, val) => {
    const d = val.replace(/\D/g, '').slice(-1)
    setOtp((prev) => {
      const next = [...prev]
      next[i] = d
      return next
    })
    if (d && i < 5) inputs.current[i + 1]?.focus()
  }
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }
  const onPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    e.preventDefault()
    setOtp(pasted.split(''))
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const masked = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`

  return (
    <div className="auth-page">
      <OceanBackdrop />
      <div className="auth-card glass-panel">
        <div className="auth-brand">
          <OrcaMark />
          <span className="auth-wordmark">ORCA</span>
        </div>
        <p className="auth-kicker">Secure access</p>

        <h1 className="auth-title">Verify your number</h1>
        <p className="auth-sub">We've sent a verification code to</p>
        <p className="auth-phone">{masked}</p>

        <div className="otp-row" onPaste={onPaste}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              value={d}
              autoFocus={i === 0}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
            />
          ))}
        </div>

        <button className="auth-primary" disabled={!full} onClick={onVerify}>
          Verify <ArrowRight size={16} strokeWidth={2.3} />
        </button>

        <div className="otp-foot">
          <button className="auth-back" onClick={onBack}>
            <ArrowLeft size={13} strokeWidth={2.2} /> Back
          </button>
          <span className="otp-resend-wrap">
            {count > 0 ? (
              <span className="otp-resend-count">
                <RotateCcw size={11} strokeWidth={2.2} /> Resend in {count}s
              </span>
            ) : (
              <button className="otp-resend" onClick={resend}>Resend OTP</button>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
