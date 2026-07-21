import { useState, useEffect, useMemo, useCallback } from 'react'
import { createTodayRepository, createSubjectRepository } from '../../../lib/repositories'
import type { ClassItem, AttendanceSummary, CurrentClass, NextClass, AttendanceRecord } from '../../../lib/models'

export const useToday = () => {
  const repository = useMemo(() => createTodayRepository(), [])
  const subjectRepository = useMemo(() => createSubjectRepository(), [])

  const [currentClass, setCurrentClass] = useState<CurrentClass | null>(null)
  const [nextClass, setNextClass] = useState<NextClass | null>(null)
  const [timeline, setTimeline] = useState<ClassItem[]>([])
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null)
  const [attendanceRecord, setAttendanceRecord] = useState<AttendanceRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const [currRes, nextRes, tlRes, summaryRes, subjectsRes] = await Promise.allSettled([
        repository.getCurrentClass(),
        repository.getNextClass(),
        repository.getTimeline(),
        repository.getAttendanceSummary(),
        subjectRepository.getSubjects(),
      ])

      let anyFailure = false

      if (currRes.status === 'fulfilled') {
        setCurrentClass(currRes.value)
      } else {
        anyFailure = true
      }

      if (nextRes.status === 'fulfilled') {
        setNextClass(nextRes.value)
      } else {
        anyFailure = true
      }

      if (tlRes.status === 'fulfilled') {
        setTimeline(tlRes.value)
      } else {
        anyFailure = true
      }

      if (summaryRes.status === 'fulfilled') {
        setAttendanceSummary(summaryRes.value)
      } else {
        anyFailure = true
      }

      // Check current class attendance record
      if (currRes.status === 'fulfilled' && currRes.value && subjectsRes.status === 'fulfilled') {
        const curr = currRes.value
        const subjectObj = subjectsRes.value.find((s) => s.name === curr.subject)
        if (subjectObj) {
          const history = await subjectRepository.getAttendanceHistory(subjectObj.id)
          const todayStr = new Date().toISOString().split('T')[0]
          const recordForToday = history.find((r) => r.date === todayStr) || null
          setAttendanceRecord(recordForToday)
        } else {
          setAttendanceRecord(null)
        }
      } else {
        setAttendanceRecord(null)
      }

      setHasError(anyFailure)
      setIsLoading(false)
    } catch {
      setHasError(true)
      setIsLoading(false)
    }
  }, [repository, subjectRepository])

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      try {
        const [currRes, nextRes, tlRes, summaryRes, subjectsRes] = await Promise.allSettled([
          repository.getCurrentClass(),
          repository.getNextClass(),
          repository.getTimeline(),
          repository.getAttendanceSummary(),
          subjectRepository.getSubjects(),
        ])

        if (!active) return

        let anyFailure = false

        if (currRes.status === 'fulfilled') {
          setCurrentClass(currRes.value)
        } else {
          anyFailure = true
        }

        if (nextRes.status === 'fulfilled') {
          setNextClass(nextRes.value)
        } else {
          anyFailure = true
        }

        if (tlRes.status === 'fulfilled') {
          setTimeline(tlRes.value)
        } else {
          anyFailure = true
        }

        if (summaryRes.status === 'fulfilled') {
          setAttendanceSummary(summaryRes.value)
        } else {
          anyFailure = true
        }

        // Check current class attendance record
        if (currRes.status === 'fulfilled' && currRes.value && subjectsRes.status === 'fulfilled') {
          const curr = currRes.value
          const subjectObj = subjectsRes.value.find((s) => s.name === curr.subject)
          if (subjectObj) {
            const history = await subjectRepository.getAttendanceHistory(subjectObj.id)
            const todayStr = new Date().toISOString().split('T')[0]
            const recordForToday = history.find((r) => r.date === todayStr) || null
            if (active) setAttendanceRecord(recordForToday)
          } else {
            if (active) setAttendanceRecord(null)
          }
        } else {
          if (active) setAttendanceRecord(null)
        }

        setHasError(anyFailure)
        setIsLoading(false)
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
  }, [repository, subjectRepository])

  return {
    currentClass,
    nextClass,
    timeline,
    attendanceSummary,
    attendanceRecord,
    isLoading,
    hasError,
    reload: loadData,
  }
}

export default useToday
