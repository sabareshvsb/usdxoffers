// ---------------------------------------------------------------------------
// Persistence layer — localStorage-backed, API-shaped.
//
// The rest of the app talks ONLY to these functions (or the React store on
// top). Swapping in Supabase/Firebase later means re-implementing this module's
// surface against the remote database; UI files stay untouched.
// ---------------------------------------------------------------------------

import { createSeedState } from './seed'

const STATE_KEY = 'usdx_smart_state_v1'
const SESSION_KEY = 'usdx_smart_admin_session_v1'

export function readState() {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function writeState(state) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function loadState() {
  return readState() ?? createSeedState()
}

export function saveState(state) {
  writeState(state)
}

export function resetState() {
  const fresh = createSeedState()
  writeState(fresh)
  return fresh
}

export function clearAllData() {
  try {
    localStorage.removeItem(STATE_KEY)
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* noop */
  }
}

// ----- Session (mock auth; replace with real auth provider later) -----
export function readSession() {
  try {
    return localStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function writeSession(active) {
  try {
    if (active) localStorage.setItem(SESSION_KEY, '1')
    else localStorage.removeItem(SESSION_KEY)
    return true
  } catch {
    return false
  }
}