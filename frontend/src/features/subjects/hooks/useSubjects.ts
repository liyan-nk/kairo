import { useState, useEffect, useMemo, useCallback } from 'react'
import { createSubjectRepository } from '../../../lib/repositories'
import type { Subject } from '../../../lib/models'

/**
 * Custom hook managing the Subjects feature data loading and state transitions.
 * Communicates with the SubjectRepository asynchronously.
 */
export const useSubjects = () => {
  const repository = useMemo(() => createSubjectRepository(), [])

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const items = await repository.getSubjects()
      setSubjects(items)
      setIsLoading(false)
    } catch {
      setHasError(true)
      setIsLoading(false)
    }
  }, [repository])

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      try {
        const items = await repository.getSubjects()
        if (active) {
          setSubjects(items)
          setIsLoading(false)
        }
      } catch {
        if (active) {
          setHasError(true)
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [repository])

  return {
    subjects,
    isLoading,
    hasError,
    reload: loadData,
  }
}

export default useSubjects
