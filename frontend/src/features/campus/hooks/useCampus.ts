import { useState, useCallback } from 'react'

/**
 * Placeholder hook defining the public API contract for Campus Page data fetching.
 * TODO: Connect to CampusRepository in subsequent phases.
 */
export const useCampus = () => {
  const [items, setItems] = useState<unknown[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setItems([])
    setIsLoading(false)
  }, [])

  return {
    items,
    isLoading,
    error,
    reload,
  }
}

export default useCampus
