import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const logout = () => signOut(auth)

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
    setCurrentUser({ uid: 'magic-user-123', phoneNumber: '+919999999999' })
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
      {!loading && children}
    </AuthContext.Provider>
  )
}
