import { useState, useEffect, useMemo, useCallback } from 'react'
import { createTodayRepository } from '../../../lib/repositories'
import type { ClassItem, AttendanceSummary, CurrentClass, NextClass } from '../../../lib/models'

export const useToday = () => {
  const repository = useMemo(() => createTodayRepository(), [])

  const [currentClass, setCurrentClass] = useState<CurrentClass | null>(null)
  const [nextClass, setNextClass] = useState<NextClass | null>(null)
  const [timeline, setTimeline] = useState<ClassItem[]>([])
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const [curr, next, tl, summary] = await Promise.all([
        repository.getCurrentClass(),
        repository.getNextClass(),
        repository.getTimeline(),
        repository.getAttendanceSummary(),
      ])
      setCurrentClass(curr)
      setNextClass(next)
      setTimeline(tl)
      setAttendanceSummary(summary)
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
        const [curr, next, tl, summary] = await Promise.all([
          repository.getCurrentClass(),
          repository.getNextClass(),
          repository.getTimeline(),
          repository.getAttendanceSummary(),
        ])
        if (active) {
          setCurrentClass(curr)
          setNextClass(next)
          setTimeline(tl)
          setAttendanceSummary(summary)
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
    currentClass,
    nextClass,
    timeline,
    attendanceSummary,
    isLoading,
    hasError,
    reload: loadData,
  }
}

export default useToday
