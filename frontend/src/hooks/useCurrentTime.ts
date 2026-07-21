import { useState, useEffect, useCallback } from 'react'
import { formatMinutesTo12HourTime, getMinutesFromMidnight } from '../features/timetable/utils/liveSchedule'

export interface CurrentTimeState {
  now: Date
  currentMinute: number
  currentTimeLabel: string
}

/**
 * Reusable timer hook that synchronizes updates to the exact start of each minute.
 * Automatically pauses when tab is hidden and updates immediately on visibility resume.
 */
export function useCurrentTime(): CurrentTimeState {
  const [now, setNow] = useState<Date>(() => new Date())

  const updateTime = useCallback(() => {
    setNow(new Date())
  }, [])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let intervalId: ReturnType<typeof setInterval> | null = null

    const scheduleMinuteSync = () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)

      const currentDate = new Date()
      setNow(currentDate)

      // Calculate milliseconds remaining until exact 00 seconds boundary of next minute
      const seconds = currentDate.getSeconds()
      const millis = currentDate.getMilliseconds()
      const delayUntilNextMinute = Math.max(10, (60 - seconds) * 1000 - millis)

      timeoutId = setTimeout(() => {
        updateTime()
        // Subsequent updates occur on exact 60,000ms minute boundaries
        intervalId = setInterval(updateTime, 60000)
      }, delayUntilNextMinute)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause timers while tab is hidden
        if (timeoutId) clearTimeout(timeoutId)
        if (intervalId) clearInterval(intervalId)
      } else {
        // Tab became visible: update immediately & re-sync to minute boundary
        scheduleMinuteSync()
      }
    }

    scheduleMinuteSync()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [updateTime])

  const currentMinute = getMinutesFromMidnight(now)
  const currentTimeLabel = formatMinutesTo12HourTime(currentMinute)

  return {
    now,
    currentMinute,
    currentTimeLabel,
  }
}

export default useCurrentTime
