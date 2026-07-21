import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { createAuthRepository } from '../lib/repositories'
import type { UserSession } from '../lib/repositories/SessionPersistence'
import AppBootstrap from './AppBootstrap'

interface AuthContextValue {
  user: UserSession['user'] | null
  isAuthenticated: boolean
  isLoadingSession: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authRepo = useMemo(() => createAuthRepository(), [])
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  useEffect(() => {
    let active = true
    const initSession = async () => {
      try {
        const initial = await authRepo.getInitialSession()
        if (active) {
          setSession(initial)
          setIsLoadingSession(false)
        }
      } catch {
        if (active) {
          setSession(null)
          setIsLoadingSession(false)
        }
      }
    }
    initSession()
    return () => {
      active = false
    }
  }, [authRepo])

  const login = useCallback(
    async (email: string, password: string) => {
      const newSession = await authRepo.login(email, password)
      setSession(newSession)
    },
    [authRepo]
  )

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const newSession = await authRepo.signup(name, email, password)
      setSession(newSession)
    },
    [authRepo]
  )

  const logout = useCallback(async () => {
    await authRepo.logout()
    setSession(null)
  }, [authRepo])

  const value = useMemo(
    () => ({
      user: session?.user || null,
      isAuthenticated: !!session,
      isLoadingSession,
      login,
      signup,
      logout,
    }),
    [session, isLoadingSession, login, signup, logout]
  )

  if (isLoadingSession) {
    return <AppBootstrap />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

export default AuthContext
