import React from 'react'
import Dialog from '../../../components/Dialog'
import Typography from '../../../components/Typography'
import AttendanceActionCard from './AttendanceActionCard'
import AttendanceRecordedCard from './AttendanceRecordedCard'

interface AttendanceDialogProps {
  isOpen: boolean
  onClose: () => void
  subjectName: string
  attendanceState: 'notMarked' | 'present' | 'absent'
  recordedRecordId: string | null
  onMarkAttendance: (status: 'Present' | 'Absent') => void
  onUndoAttendance: (recordId: string) => void
  isSubmitting?: boolean
}

export const AttendanceDialog: React.FC<AttendanceDialogProps> = ({
  isOpen,
  onClose,
  subjectName,
  attendanceState,
  recordedRecordId,
  onMarkAttendance,
  onUndoAttendance,
  isSubmitting = false,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Edit Attendance">
      <div className="space-y-4 pt-1">
        <Typography variant="body" weight="semibold">
          {subjectName}
        </Typography>

        {attendanceState === 'notMarked' ? (
          <AttendanceActionCard
            onMarkPresent={() => {
              onMarkAttendance('Present')
              onClose()
            }}
            onMarkAbsent={() => {
              onMarkAttendance('Absent')
              onClose()
            }}
            disabled={isSubmitting}
          />
        ) : (
          <AttendanceRecordedCard
            status={attendanceState}
            onUndo={() => {
              if (recordedRecordId) onUndoAttendance(recordedRecordId)
              onClose()
            }}
            disabled={isSubmitting}
          />
        )}
      </div>
    </Dialog>
  )
}

export default AttendanceDialog
