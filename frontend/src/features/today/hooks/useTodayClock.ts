import { useState, useEffect } from 'react'

export const useTodayClock = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate live countdown based on simulated start point of 10:18 AM
  // 10:18 AM is 618 minutes from midnight. End of class is 11:00 AM (660 minutes).
  const totalElapsedMinutes = Math.floor(elapsedSeconds / 60)
  const simulatedMinutesLeft = Math.max(0, 660 - (618 + totalElapsedMinutes))

  return {
    elapsedSeconds,
    simulatedMinutesLeft,
  }
}

export default useTodayClock
