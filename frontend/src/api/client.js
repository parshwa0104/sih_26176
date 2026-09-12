export const API_BASE = import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE.replace(/\/+$/, '')
  : (import.meta.env.PROD ? '' : 'http://localhost:8000');

async function getJSON(path, { timeoutMs = 8000 } = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

export const getConditions = () => getJSON('/conditions')
export const getPfzZones = () => getJSON('/pfz-zones')
export const getSeaState = () => getJSON('/sea-state')

/**
 * POST /query — streams the ORCA AI pipeline's answer token by token via SSE.
 * onToken(text) fires per chunk; onDone(payload) fires once with the final
 * { text, map_data, reasoning_trail, safety_status }.
 */
export async function sendQuery(message, history = [], { onToken, onDone, timeoutMs = 60000, signal } = {}) {
  const ctrl = new AbortController()
  let timer = setTimeout(() => ctrl.abort(), timeoutMs)
  const resetTimer = () => {
    clearTimeout(timer)
    timer = setTimeout(() => ctrl.abort(), timeoutMs)
  }
  if (signal) signal.addEventListener('abort', () => ctrl.abort())

  let fullText = ''
  let finalPayload = null

  try {
    const res = await fetch(`${API_BASE}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ message, history }),
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    if (!res.body) throw new Error('No response body (streaming not supported)')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      resetTimer()
      buffer += decoder.decode(value, { stream: true })

      const frames = buffer.split('\n\n')
      buffer = frames.pop()

      for (const frame of frames) {
        const line = frame.trim()
        if (!line.startsWith('data:')) continue
        const payload = line.slice(5).trim()
        if (payload === '[DONE]') continue

        const event = JSON.parse(payload)
        if (event.type === 'token') {
          fullText += event.text
          onToken?.(event.text, fullText)
        } else if (event.type === 'done') {
          finalPayload = event
          onDone?.(event)
        }
      }
    }
    return finalPayload ?? { text: fullText }
  } finally {
    clearTimeout(timer)
  }
}