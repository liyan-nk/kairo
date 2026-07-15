import { useState, useCallback } from 'react'

/**
 * Placeholder hook defining the public API contract for Subjects Page data fetching.
 * TODO: Connect to SubjectRepository in subsequent phases.
 */
export const useSubjects = () => {
  const [subjects, setSubjects] = useState<unknown[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setSubjects([])
    setIsLoading(false)
  }, [])

  return {
    subjects,
    isLoading,
    error,
    reload,
  }
}

export default useSubjects
