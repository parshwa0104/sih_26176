// ORCA backend client.
// Base URL is configurable via VITE_API_BASE; falls back to the local dev backend.

export const API_BASE = (
  import.meta.env.VITE_API_BASE || 'http://localhost:8000'
).replace(/\/+$/, '')

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
 * POST /query — the ORCA AI pipeline. The backend runs a multi-agent LLM
 * chain (Ollama), so this can take several seconds; we allow a generous
 * timeout and surface AbortError to the caller for a clean "timed out" state.
 *
 * Contract is unchanged: request body is exactly { message }.
 */
export async function sendQuery(message, { timeoutMs = 45000 } = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(`${API_BASE}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}
