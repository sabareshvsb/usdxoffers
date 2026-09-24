// ---------------------------------------------------------------------------
// React bridge over the persistence layer.
// Provides `useStore()` so every component — public site and admin panel —
// reads and mutates the same live state. Mutations persist to localStorage and
// propagate instantly across open tabs via the `storage` event.
// ---------------------------------------------------------------------------

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loadState, saveState } from '../lib/store'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => loadState())

  const setPartial = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveState(next)
      return next
    })
  }, [])

  useEffect(() => {
    const sync = (e) => {
      if (e.key === 'usdx_smart_state_v1') {
        setState(loadState())
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const value = useMemo(
    () => ({ state, setPartial, resetStore: () => setState(loadState()) }),
    [state, setPartial],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

// Convenience selector for a single slice.
export function useCampaign() {
  return useStore().state.campaign
}
export function useOffers() {
  return useStore().state.offers
}
export function useLeaders() {
  return useStore().state.leaders
}