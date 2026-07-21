import React from 'react'
import Button from '../../../components/Button'

interface AttendanceActionCardProps {
  onMarkPresent: () => void
  onMarkAbsent: () => void
  disabled?: boolean
}

/**
 * AttendanceActionCard renders the Present and Absent action buttons for an unmarked class.
 */
export const AttendanceActionCard: React.FC<AttendanceActionCardProps> = ({
  onMarkPresent,
  onMarkAbsent,
  disabled = false,
}) => {
  return (
    <div className="space-y-2 select-none">
      <div className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
        Mark Attendance
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          fullWidth
          onClick={onMarkPresent}
          disabled={disabled}
        >
          Present
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={onMarkAbsent}
          disabled={disabled}
        >
          Absent
        </Button>
      </div>
    </div>
  )
}

export default AttendanceActionCard
