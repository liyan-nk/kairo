import React, { useState, useMemo } from 'react'
import { AlertCircle } from 'lucide-react'
import Typography from '../../components/Typography'
import Skeleton from '../../components/Skeleton'
import useToast from '../../hooks/useToast'
import { createSubjectRepository } from '../../lib/repositories'
import type { Subject } from '../../lib/models'
import type { ViewState } from './types'
import useTodayClock from './hooks/useTodayClock'
import useToday from './hooks/useToday'
import GreetingHeader from './components/GreetingHeader'
import TodayEmptyState from './components/TodayEmptyState'
import CurrentClassCard from './components/CurrentClassCard'
import NextClassCard from './components/NextClassCard'
import Timeline from './components/Timeline'
import AttendanceSummaryCard from './components/AttendanceSummaryCard'
import { deriveTodayViewModel } from './utils/todayViewModel'

export const TodayPage: React.FC = () => {
  const { showToast } = useToast()
  const { simulatedMinutesLeft } = useTodayClock()
  const subjectRepository = useMemo(() => createSubjectRepository(), [])
  const {
    currentClass: realCurrentClass,
    nextClass: realNextClass,
    timeline: realTimeline,
    attendanceSummary,
    attendanceRecord,
    isLoading,
    hasError,
    reload,
  } = useToday()

  // Dev-friendly state switcher toggle
  const [viewState, setViewState] = useState<ViewState>('active')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleMarkAttendance = async (status: 'Present' | 'Absent') => {
    if (!viewModel.currentClass || isSubmitting) return
    setIsSubmitting(true)
    try {
      const subjects = await subjectRepository.getSubjects()
      const subjectObj = subjects.find((s: Subject) => s.name === viewModel.currentClass?.subject)
      if (subjectObj) {
        const slotId = 'slot_current'
        await subjectRepository.markAttendance(subjectObj.id, slotId, status)
        await reload()
        showToast(`Attendance Recorded (${status}) ✓`)
        if (navigator.vibrate) {
          navigator.vibrate(10)
        }
      }
    } catch {
      showToast('Failed to record attendance')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUndoAttendance = async (recordId: string) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await subjectRepository.undoAttendance(recordId)
      await reload()
      showToast('Attendance Undone')
      if (navigator.vibrate) {
        navigator.vibrate(10)
      }
    } catch {
      showToast('Failed to undo attendance')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine if absolutely any cached/usable data is loaded in state
  const hasUsableData = realTimeline.length > 0 || attendanceSummary !== null || realCurrentClass !== null || realNextClass !== null

  // Compute presentation state using the pure view-model mapper
  const viewModel = deriveTodayViewModel({
    viewState,
    isLoading,
    hasError,
    hasUsableData,
    realCurrentClass,
    realNextClass,
    realTimeline,
    realMinutesLeft: simulatedMinutesLeft,
    attendanceRecord,
  })

  // Render Skeletons for Loading State
  if (viewModel.computedState === 'loading') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <header className="space-y-2">
          <Skeleton variant="text" width="40%" height="28px" />
          <Skeleton variant="text" width="60%" height="16px" />
        </header>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton variant="text" width="25%" height="14px" />
            <Skeleton variant="rectangular" height="180px" className="rounded-large" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width="25%" height="14px" />
            <Skeleton variant="rectangular" height="100px" className="rounded-large" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width="30%" height="14px" />
            <Skeleton variant="rectangular" height="220px" className="rounded-large" />
          </div>
        </div>
      </div>
    )
  }

  // Handle Full-Screen Empty and Error views (only unrecoverable errors)
  if (viewModel.computedState === 'error') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <TodayEmptyState
          viewState={viewModel.computedState}
          onRetry={reload}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Dynamic Header */}
      <GreetingHeader />

      {/* Offline Warning Banner */}
      {hasError && hasUsableData && (
        <div className="flex items-center gap-3 p-4 bg-brand-danger/10 border border-brand-danger/20 rounded-medium text-brand-danger select-none animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1 text-[14px] font-medium leading-tight">
            Using offline data. Fresh timetable could not be loaded.
          </div>
        </div>
      )}

      {/* Main Content Areas */}
      <div className="space-y-6">
        
        {/* Current Class Section */}
        <section className="space-y-2">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Current Class
          </Typography>
          
          {['holiday', 'dayEnded', 'beforeFirst', 'freePeriod'].includes(viewModel.computedState) ? (
            <TodayEmptyState viewState={viewModel.computedState} className="my-0 max-w-none w-full" />
          ) : (
            viewModel.currentClass && (
              <CurrentClassCard
                subject={viewModel.currentClass.subject}
                room={viewModel.currentClass.room}
                faculty={viewModel.currentClass.faculty}
                minutesLeft={viewModel.minutesLeft ?? simulatedMinutesLeft}
                attendanceState={viewModel.attendanceState}
                recordedRecordId={viewModel.recordedRecordId}
                onMarkAttendance={handleMarkAttendance}
                onUndoAttendance={handleUndoAttendance}
                onReportChange={() => showToast('Discrepancy Reported ✓')}
                isSubmitting={isSubmitting}
              />
            )
          )}
        </section>

        {/* Next Class Section */}
        {viewModel.nextClass && (
          <section className="space-y-2">
            <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
              Next Class
            </Typography>
            <NextClassCard
              subject={viewModel.nextClass.subject}
              room={viewModel.nextClass.room}
              faculty={viewModel.nextClass.faculty}
              startTime={viewModel.nextClass.startTime}
            />
          </section>
        )}

        {/* Today's Timeline Section */}
        {viewModel.timeline.length > 0 && (
          <section className="space-y-3">
            <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
              Today's Timeline
            </Typography>
            <Timeline items={viewModel.timeline} />
          </section>
        )}

        {/* Attendance Summary Section */}
        {attendanceSummary && (
          <section className="space-y-2">
            <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
              Attendance Summary
            </Typography>
            <AttendanceSummaryCard
              status={attendanceSummary.status}
              percentage={attendanceSummary.percentage}
            />
          </section>
        )}
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
