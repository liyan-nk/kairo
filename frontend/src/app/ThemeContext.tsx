import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

export type ThemeOption = 'Light' | 'Dark' | 'System'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: ThemeOption
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeOption) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_STORAGE_KEY = 'kairo_theme_v1'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeOption>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved === 'Light' || saved === 'Dark' || saved === 'System') {
        return saved
      }
    } catch {
      // Fallback
    }
    return 'System'
  })

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  // Listen to OS prefers-color-scheme live changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (theme === 'Light') return 'light'
    if (theme === 'Dark') return 'dark'
    return systemIsDark ? 'dark' : 'light'
  }, [theme, systemIsDark])

  // Sole place touching document.documentElement.dataset.theme
  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
  }, [resolvedTheme])

  const setTheme = useCallback((newTheme: ThemeOption) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch (err) {
      console.error('Failed to save theme preference', err)
    }
  }, [])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}

export default ThemeContext
