import { onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'

const AuthContext = createContext()

// ── Demo ("magic") session ─────────────────────────────────────────────────
// The hackathon bypass (+91 99999 99999 / OTP 123456) never talks to Firebase,
// so there's no Firebase session for signOut() to clear and no persistence
// across reloads. We give it its own lightweight persisted session instead:
// a flag in localStorage that the auth listener restores on load, and that
// logout() explicitly removes. A real Firebase session always takes priority.
const MAGIC_SESSION_KEY = 'orca.magicSession'
const MAGIC_USER = {
  uid: 'magic-user-123',
  phoneNumber: '+919999999999',
  isMagic: true, // lets the rest of the app tell a demo session apart
}

const readMagicSession = () => {
  try {
    return localStorage.getItem(MAGIC_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

const writeMagicSession = (on) => {
  try {
    if (on) localStorage.setItem(MAGIC_SESSION_KEY, '1')
    else localStorage.removeItem(MAGIC_SESSION_KEY)
  } catch {
    /* storage unavailable — demo session just won't persist across reloads */
  }
}

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      // A real Firebase session wins; otherwise fall back to a persisted
      // demo session if one exists.
      setCurrentUser(user || (readMagicSession() ? MAGIC_USER : null))
      setLoading(false)
    })
  }, [])

  const logout = async () => {
    writeMagicSession(false)
    try {
      await signOut(auth)
    } catch {
      /* no real Firebase session to end — expected for demo sessions */
    }
    try {
      window.recaptchaVerifier?.clear?.()
    } catch {
      /* ignore */
    }
    window.recaptchaVerifier = undefined
    setCurrentUser(null)
  }

  const setupRecaptcha = (buttonId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
        size: 'invisible',
      })
    }
  }

  const sendOtp = async (phoneNumber) => {
    // MAGIC BYPASS FOR HACKATHON DEMO
    if (phoneNumber === '+919999999999') {
      return { isMagic: true }
    }

    const appVerifier = window.recaptchaVerifier
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  }

  const magicLogin = () => {
    writeMagicSession(true)
    setCurrentUser(MAGIC_USER)
  }

  const value = {
    currentUser,
    logout,
    setupRecaptcha,
    sendOtp,
    magicLogin,
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? <AuthSplash /> : children}
    </AuthContext.Provider>
  )
}

/** Shown for the brief moment while the auth state resolves on load. */
function AuthSplash() {
  return (
    <div className="grid min-h-[100dvh] w-full place-items-center bg-ocean-900">
      <span className="font-display text-readout font-bold uppercase tracking-[0.18em] text-ink-dim">
        ORCA
      </span>
    </div>
  )
}
