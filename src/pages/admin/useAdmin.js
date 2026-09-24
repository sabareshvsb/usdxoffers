import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { readSession, writeSession } from '../../lib/store'
import { useStore } from '../../store/StoreContext'

export function useAdminSession() {
  const { state } = useStore()
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(() => readSession())

  const login = useCallback(
    (password) => {
      const ok = typeof password === 'string' && password === state.settings.adminPassword
      if (ok) {
        writeSession(true)
        setAuthed(true)
      }
      return ok
    },
    [state.settings.adminPassword],
  )

  const logout = useCallback(() => {
    writeSession(false)
    setAuthed(false)
    navigate('/admin/login')
  }, [navigate])

  return { authed, login, logout }
}