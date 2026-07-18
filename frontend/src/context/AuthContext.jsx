import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '@/services/authService'
import { tokenStore } from '@/services/api'

export const AuthContext = createContext(null)

/** Admin authentication state (JWT held in sessionStorage). */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function restore() {
      if (!tokenStore.get()) {
        setLoading(false)
        return
      }
      try {
        const me = await authService.me()
        if (!cancelled) setUser(me)
      } catch {
        tokenStore.clear()
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, logout }),
    [user, loading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
