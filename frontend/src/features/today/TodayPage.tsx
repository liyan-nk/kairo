import React, { useState } from 'react'
import Typography from '../../components/Typography'
import Skeleton from '../../components/Skeleton'
import useToast from '../../hooks/useToast'
import type { ViewState } from './types'
import {
  getMockCurrentClass,
  getMockNextClass,
  getMockTimeline,
  getMockAttendanceSummary,
} from './data/mockToday'
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

  // Dev-friendly state toggle for previewing empty/loading conditions
  const [viewState, setViewState] = useState<ViewState>('active')
  const [attendance, setAttendance] = useState<'present' | 'absent' | null>(null)

  const handleMarkAttendance = (status: 'present' | 'absent') => {
    setAttendance(status)
    showToast('Attendance Updated ✓')
    if (navigator.vibrate) {
      navigator.vibrate(10) // Light haptic tick
    }
  }

  // Retrieve isolated mock data
  const currentClass = getMockCurrentClass()
  const nextClass = getMockNextClass()
  const timelineItems = getMockTimeline()
  const attendanceSummary = getMockAttendanceSummary()

  // Render Skeletons for Loading State
  if (viewState === 'loading') {
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
  const isFullScreenEmptyState = ['error', 'holiday', 'dayEnded', 'beforeFirst'].includes(viewState)
  if (isFullScreenEmptyState) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <TodayEmptyState
          viewState={viewState}
          onRetry={() => setViewState('active')}
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
          
          {viewState === 'freePeriod' ? (
            <TodayEmptyState viewState="freePeriod" />
          ) : (
            <CurrentClassCard
              subject={currentClass.subject}
              room={currentClass.room}
              faculty={currentClass.faculty}
              minutesLeft={simulatedMinutesLeft}
              attendance={attendance}
              onMarkAttendance={handleMarkAttendance}
              onReportChange={() => showToast('Discrepancy Reported ✓')}
            />
          )}
        </section>

        {/* Next Class Section */}
        <section className="space-y-2">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Next Class
          </Typography>
          <NextClassCard
            subject={nextClass.subject}
            room={nextClass.room}
            faculty={nextClass.faculty}
            startTime={nextClass.startTime}
          />
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
          <AttendanceSummaryCard
            status={attendanceSummary.status}
            percentage={attendanceSummary.percentage}
          />
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
