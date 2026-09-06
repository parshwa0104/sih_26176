import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Thin wrapper around the Web Speech API (SpeechRecognition).
 * Gracefully reports `supported: false` where the API is missing.
 *
 * @param {string} langCode  BCP-47 tag, e.g. "hi-IN"
 * @param {(transcript: string) => void} onResult
 */
export function useSpeech(langCode, onResult) {
  const Recognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  const supported = Boolean(Recognition)

  const [listening, setListening] = useState(false)
  const recRef = useRef(null)
  const onResultRef = useRef(onResult)

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    if (!supported) return
    const rec = new Recognition()
    rec.continuous = false
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.lang = langCode || 'en-IN'
    rec.onresult = (e) => {
      const transcript = e?.results?.[0]?.[0]?.transcript
      if (transcript) onResultRef.current?.(transcript.trim())
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    return () => {
      try {
        rec.abort()
      } catch {
        /* ignore */
      }
      recRef.current = null
    }
  }, [supported, langCode, Recognition])

  const toggle = useCallback(() => {
    const rec = recRef.current
    if (!rec) return
    if (listening) {
      try {
        rec.stop()
      } catch {
        /* ignore */
      }
      setListening(false)
    } else {
      try {
        rec.start()
        setListening(true)
      } catch {
        setListening(false)
      }
    }
  }, [listening])

  return { supported, listening, toggle }
}
