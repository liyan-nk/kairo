import React, { useState, useEffect, useMemo } from 'react'
import Typography from '../../components/Typography'
import Skeleton from '../../components/Skeleton'
import useToast from '../../hooks/useToast'
import type { ViewState } from './types'
import type { ClassItem, AttendanceSummary, CurrentClass, NextClass } from '../../lib/models'
import { createTodayRepository } from '../../lib/repositories'
import useTodayClock from './hooks/useTodayClock'
import GreetingHeader from './components/GreetingHeader'
import TodayEmptyState from './components/TodayEmptyState'
import CurrentClassCard from './components/CurrentClassCard'
import NextClassCard from './components/NextClassCard'
import Timeline from './components/Timeline'
import AttendanceSummaryCard from './components/AttendanceSummaryCard'

export const TodayPage: React.FC = () => {
  const { showToast } = useToast()
  const { simulatedMinutesLeft } = useTodayClock()

  // Repository client factory
  const repository = useMemo(() => createTodayRepository(), [])

  // Dev-friendly state switcher toggle
  const [viewState, setViewState] = useState<ViewState>('active')
  const [attendance, setAttendance] = useState<'present' | 'absent' | null>(null)

  // Asynchronous repository data states
  const [currentClass, setCurrentClass] = useState<CurrentClass | null>(null)
  const [nextClass, setNextClass] = useState<NextClass | null>(null)
  const [timelineItems, setTimelineItems] = useState<ClassItem[]>([])
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setHasError(false)

    const loadTimetable = async () => {
      try {
        const [curr, next, timeline, summary] = await Promise.all([
          repository.getCurrentClass(),
          repository.getNextClass(),
          repository.getTimeline(),
          repository.getAttendanceSummary(),
        ])

        if (active) {
          setCurrentClass(curr);
          setNextClass(next);
          setTimelineItems(timeline);
          setAttendanceSummary(summary);
          setIsLoading(false);
        }
      } catch (err) {
        if (active) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    }

    loadTimetable()

    return () => {
      active = false
    }
  }, [repository])

  const handleMarkAttendance = (status: 'present' | 'absent') => {
    setAttendance(status)
    showToast('Attendance Updated ✓')
    if (navigator.vibrate) {
      navigator.vibrate(10) // Light haptic tick
    }
  }

  // Determine final render state (dev switcher overrides real async state for testing layout options)
  const computedState = viewState !== 'active' ? viewState : (hasError ? 'error' : (isLoading ? 'loading' : 'active'))

  // Render Skeletons for Loading State
  if (computedState === 'loading') {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <Skeleton variant="text" width="40%" height="28px" />
          <Skeleton variant="text" width="60%" height="16px" />
        </header>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton variant="text" width="20%" />
            <Skeleton variant="rectangular" height="160px" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width="20%" />
            <Skeleton variant="rectangular" height="88px" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="rectangular" height="240px" />
          </div>
        </div>
      </div>
    )
  }

  // Handle Full-Screen Empty and Error views:
  // 'error' | 'holiday' | 'dayEnded' | 'beforeFirst'
  const isFullScreenEmptyState = ['error', 'holiday', 'dayEnded', 'beforeFirst'].includes(computedState)
  if (isFullScreenEmptyState) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <TodayEmptyState
          viewState={computedState}
          onRetry={() => {
            setViewState('active')
            setIsLoading(true)
            setHasError(false)
            // Trigger retry by refreshing dependencies or direct function reload
            repository.getCurrentClass()
              .then(() => repository.getNextClass())
              .then(() => repository.getTimeline())
              .then(() => repository.getAttendanceSummary())
              .then(() => setIsLoading(false))
              .catch(() => {
                setHasError(true)
                setIsLoading(false)
              })
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Dynamic Header */}
      <GreetingHeader />

      {/* Main Content Areas */}
      <div className="space-y-6">
        
        {/* Current Class Section */}
        <section className="space-y-2">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Current Class
          </Typography>
          
          {computedState === 'freePeriod' ? (
            <TodayEmptyState viewState="freePeriod" />
          ) : (
            currentClass && (
              <CurrentClassCard
                subject={currentClass.subject}
                room={currentClass.room}
                faculty={currentClass.faculty}
                minutesLeft={simulatedMinutesLeft}
                attendance={attendance}
                onMarkAttendance={handleMarkAttendance}
                onReportChange={() => showToast('Discrepancy Reported ✓')}
              />
            )
          )}
        </section>

        {/* Next Class Section */}
        <section className="space-y-2">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Next Class
          </Typography>
          {nextClass && (
            <NextClassCard
              subject={nextClass.subject}
              room={nextClass.room}
              faculty={nextClass.faculty}
              startTime={nextClass.startTime}
            />
          )}
        </section>

        {/* Today's Timeline Section */}
        <section className="space-y-3">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Today's Timeline
          </Typography>
          <Timeline items={timelineItems} />
        </section>

        {/* Attendance Summary Section */}
        <section className="space-y-2">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Attendance Summary
          </Typography>
          {attendanceSummary && (
            <AttendanceSummaryCard
              status={attendanceSummary.status}
              percentage={attendanceSummary.percentage}
            />
          )}
        </section>
      </div>

      {/* Dev-only Switcher Panel for testing state layouts */}
      {import.meta.env.DEV && (
        <div className="mt-8 p-4 bg-surface-secondary border border-border-card rounded-medium space-y-2">
          <Typography variant="micro" color="secondary" className="block font-semibold uppercase tracking-wider">
            Dev State Previewer
          </Typography>
          <div className="flex flex-wrap gap-2">
            {(['active', 'loading', 'holiday', 'beforeFirst', 'freePeriod', 'dayEnded', 'error'] as ViewState[]).map((state) => (
              <button
                key={state}
                onClick={() => setViewState(state)}
                className={`px-2.5 py-1 text-[12px] font-medium rounded-small border transition-all ${
                  viewState === state
                    ? 'bg-text-primary text-bg border-text-primary'
                    : 'bg-surface border-border-card text-text-secondary hover:text-text-primary'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TodayPage
