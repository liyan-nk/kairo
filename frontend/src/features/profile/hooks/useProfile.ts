import { useState, useCallback } from 'react'

/**
 * Placeholder hook defining the public API contract for Profile Page data fetching.
 * TODO: Connect to ProfileRepository in subsequent phases.
 */
export const useProfile = () => {
  const [profile, setProfile] = useState<unknown | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setProfile(null)
    setIsLoading(false)
  }, [])

  return {
    profile,
    isLoading,
    error,
    reload,
  }
}

export default useProfile
