import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Phone, Lock, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'
import { cx } from '../lib/format'

export default function Login() {
  const { setupRecaptcha, sendOtp, magicLogin } = useAuth()
  
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('PHONE') // 'PHONE' | 'OTP'
  const [confirmationResult, setConfirmationResult] = useState(null)

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    
    // Basic validation for India (+91)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`
    if (formattedPhone.length < 13) {
      return setError('Please enter a valid 10-digit mobile number')
    }

    setLoading(true)
    try {
      setupRecaptcha('sign-in-button')
      const result = await sendOtp(formattedPhone)
      setConfirmationResult(result)
      setStep('OTP')
    } catch (err) {
      console.error(err)
      setError(`Failed to send OTP: ${err.message || 'Check console'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length < 6) return setError('Please enter a valid 6-digit OTP')
    
    setError('')
    setLoading(true)
    try {
      console.log("Submitting OTP to Firebase:", otp)
      
      // MAGIC BYPASS
      if (confirmationResult?.isMagic) {
        if (otp === '123456') {
          magicLogin()
          return
        } else {
          throw new Error("Wrong magic OTP. Use 123456")
        }
      }

      const res = await confirmationResult.confirm(otp)
      console.log("OTP confirmed successfully! User:", res.user.uid)
      // On success, AuthContext's onAuthStateChanged will redirect automatically
    } catch (err) {
      console.error("OTP Verification Failed!", err)
      setError(`Invalid OTP: ${err.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-ocean-900 p-4 font-sans">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-hairline-strong bg-ocean-850 shadow-inst">
        
        <div className="border-b border-hairline p-6 pb-4">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white">
              <span className="font-display text-readout font-bold">O</span>
            </span>
          </div>
          <h1 className="text-center font-display text-heading uppercase text-ink">
            ORCA
          </h1>
          <p className="mt-1 text-center text-body text-ink-dim">
            Ocean Risk & Catch Advisor
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-status-danger/30 bg-status-danger/10 p-3 text-body text-status-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-label uppercase text-ink-dim">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 grid w-10 place-items-center text-ink-dim">
                    <Phone size={15} />
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full rounded-lg border border-hairline bg-surface-1 py-2.5 pl-10 pr-4 text-input text-ink placeholder:font-normal placeholder:text-ink-dim focus:border-accent focus:outline-none"
                    required
                  />
                </div>
              </div>
              
              <button
                id="sign-in-button"
                type="submit"
                disabled={loading || phone.length < 10}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-body font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Send Login Code'}
                {!loading && <ChevronRight size={16} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="otp" className="mb-1.5 block text-label uppercase text-ink-dim">
                  Enter Login Code
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 grid w-10 place-items-center text-ink-dim">
                    <Lock size={15} />
                  </span>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full rounded-lg border border-hairline bg-surface-1 py-2.5 pl-10 pr-4 text-center text-readout font-bold tracking-[0.3em] text-ink placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-dim focus:border-accent focus:outline-none"
                    required
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-center text-caption text-ink-dim">
                  Sent to +91 {phone}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-body font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Verify & Login'}
                {!loading && <ChevronRight size={16} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('PHONE')
                  setOtp('')
                  setError('')
                }}
                className="w-full text-center text-caption font-semibold text-accent hover:underline"
              >
                Use a different number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
