import React, { useState, useMemo } from 'react'
import { AlertCircle } from 'lucide-react'
import Typography from '../../components/Typography'
import Skeleton from '../../components/Skeleton'
import useToast from '../../hooks/useToast'
import useCurrentTime from '../../hooks/useCurrentTime'
import { createSubjectRepository } from '../../lib/repositories'
import type { Subject } from '../../lib/models'
import type { ViewState } from './types'
import useToday from './hooks/useToday'
import GreetingHeader from './components/GreetingHeader'
import TodayEmptyState from './components/TodayEmptyState'
import CurrentClassCard from './components/CurrentClassCard'
import NextClassCard from './components/NextClassCard'
import Timeline from './components/Timeline'
import { deriveTodayViewModel } from './utils/todayViewModel'
import { deriveTimetableViewModel } from '../timetable/utils/timetableViewModel'

export const TodayPage: React.FC = () => {
  const { showToast } = useToast()
  const { now, currentTimeLabel } = useCurrentTime()
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

  // Pure live schedule engine model derived from system clock and timetable data
  const liveTimetableVm = useMemo(() => {
    return deriveTimetableViewModel(realTimeline, now)
  }, [realTimeline, now])

  const handleMarkAttendance = async (status: 'Present' | 'Absent') => {
    const activeSubjectName = liveTimetableVm.currentClass?.subject || viewModel.currentClass?.subject
    if (!activeSubjectName || isSubmitting) return
    setIsSubmitting(true)
    try {
      const subjects = await subjectRepository.getSubjects()
      const subjectObj = subjects.find((s: Subject) => s.name === activeSubjectName)
      if (subjectObj) {
        const slotId = liveTimetableVm.currentClassSlotId || 'slot_current'
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
    realMinutesLeft: liveTimetableVm.remainingMinutes,
    attendanceRecord,
  })

  const activeCurrentClass = liveTimetableVm.currentClass || viewModel.currentClass
  const activeNextClass = liveTimetableVm.nextClass || viewModel.nextClass

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
      <GreetingHeader currentTimeLabel={currentTimeLabel} />

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
          
          {['holiday', 'dayEnded', 'beforeFirst', 'freePeriod'].includes(viewModel.computedState) || !activeCurrentClass ? (
            <TodayEmptyState
              viewState={liveTimetableVm.dayStatus === 'weekend' ? 'holiday' : (liveTimetableVm.dayStatus === 'finished' ? 'dayEnded' : viewModel.computedState)}
              customTitle={liveTimetableVm.dayStatus === 'finished' ? "You're done for today." : (liveTimetableVm.dayStatus === 'weekend' ? "No classes today." : undefined)}
              customDescription={liveTimetableVm.dayStatusLabel}
              className="my-0 max-w-none w-full"
            />
          ) : (
            activeCurrentClass && (
              <CurrentClassCard
                subject={activeCurrentClass.subject}
                room={activeCurrentClass.room}
                faculty={activeCurrentClass.faculty}
                minutesLeft={liveTimetableVm.remainingMinutes}
                countdownText={liveTimetableVm.countdownText}
                progress={liveTimetableVm.progress}
                currentTimeLabel={currentTimeLabel}
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
        {activeNextClass && (
          <section className="space-y-2">
            <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
              Next Class
            </Typography>
            <NextClassCard
              subject={activeNextClass.subject}
              room={activeNextClass.room}
              faculty={activeNextClass.faculty}
              startTime={activeNextClass.startTime}
              nextCountdownText={liveTimetableVm.nextCountdownText}
            />
          </section>
        )}

        {/* Today's Timeline Section */}
        {(liveTimetableVm.timelineItems.length > 0 || viewModel.timeline.length > 0) && (
          <section className="space-y-3">
            <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
              Today's Timeline
            </Typography>
            <Timeline items={liveTimetableVm.timelineItems.length > 0 ? liveTimetableVm.timelineItems : viewModel.timeline} />
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
