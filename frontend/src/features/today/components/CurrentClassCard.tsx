import React from 'react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import AttendanceActionCard from './AttendanceActionCard'
import AttendanceRecordedCard from './AttendanceRecordedCard'
import type { AttendanceState } from '../utils/todayViewModel'

interface CurrentClassCardProps {
  subject: string
  room: string
  faculty: string
  minutesLeft: number
  countdownText?: string
  progress?: number
  currentTimeLabel?: string
  attendanceState: AttendanceState
  recordedRecordId: string | null
  onMarkAttendance: (status: 'Present' | 'Absent') => void
  onUndoAttendance: (recordId: string) => void
  onReportChange: () => void
  isSubmitting?: boolean
}

export const CurrentClassCard: React.FC<CurrentClassCardProps> = ({
  subject,
  room,
  faculty,
  minutesLeft,
  countdownText,
  progress,
  currentTimeLabel,
  attendanceState,
  recordedRecordId,
  onMarkAttendance,
  onUndoAttendance,
  onReportChange,
  isSubmitting = false,
}) => {
  return (
    <Card variant="default" padding="lg" className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1 pr-4 min-w-0">
          <Typography variant="title" weight="bold" className="leading-tight truncate">
            {subject}
          </Typography>
          <Typography variant="caption" color="secondary">
            {faculty} · {room}
          </Typography>
        </div>
        <div className="text-right shrink-0">
          <Typography variant="body" weight="bold" className="text-brand-info leading-none">
            {countdownText || `Ends in ${minutesLeft} min`}
          </Typography>
          {currentTimeLabel && (
            <Typography variant="micro" color="secondary" className="block mt-1 font-medium">
              {currentTimeLabel}
            </Typography>
          )}
        </div>
      </div>

      {/* Live Progress Bar */}
      {typeof progress === 'number' && (
        <div className="w-full h-2 bg-surface-secondary border border-border-card/40 rounded-pill overflow-hidden">
          <div
            className="h-full bg-brand-info transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {/* Action / Feedback Section */}
      {attendanceState === 'notMarked' ? (
        <AttendanceActionCard
          onMarkPresent={() => onMarkAttendance('Present')}
          onMarkAbsent={() => onMarkAttendance('Absent')}
          disabled={isSubmitting}
        />
      ) : (
        <AttendanceRecordedCard
          status={attendanceState}
          onUndo={() => recordedRecordId && onUndoAttendance(recordedRecordId)}
          disabled={isSubmitting}
        />
      )}

      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onReportChange}
          className="text-text-secondary hover:text-text-primary text-[14px] font-medium transition-colors cursor-pointer outline-none rounded-small focus-visible:ring-1 focus-visible:ring-brand-info px-2 py-1"
        >
          Report Change
        </button>
      </div>
    </Card>
  )
}

export default CurrentClassCard
