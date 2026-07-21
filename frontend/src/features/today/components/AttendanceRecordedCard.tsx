import React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import Button from '../../../components/Button'

interface AttendanceRecordedCardProps {
  status: 'present' | 'absent'
  onUndo: () => void
  disabled?: boolean
}

/**
 * AttendanceRecordedCard renders recorded class attendance feedback with an Undo button.
 */
export const AttendanceRecordedCard: React.FC<AttendanceRecordedCardProps> = ({
  status,
  onUndo,
  disabled = false,
}) => {
  const isPresent = status === 'present'

  return (
    <div className="flex items-center justify-between p-3.5 bg-surface-secondary border border-border-card rounded-medium animate-in fade-in duration-200 select-none">
      <div className="flex items-center gap-2">
        {isPresent ? (
          <CheckCircle2 className="w-5 h-5 text-attendance-green shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-attendance-red shrink-0" />
        )}
        <span className="text-[14px] font-semibold text-text-primary">
          {isPresent ? 'Present recorded' : 'Absent recorded'}
        </span>
      </div>
      <Button
        variant="secondary"
        onClick={onUndo}
        disabled={disabled}
        className="text-[12px] font-semibold text-text-secondary hover:text-text-primary h-8 px-3"
      >
        Undo
      </Button>
    </div>
  )
}

export default AttendanceRecordedCard
