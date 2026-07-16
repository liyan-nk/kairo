import React from 'react'
import { Check, X } from 'lucide-react'
import Typography from '../../../components/Typography'
import type { AttendanceRecord } from '../../../lib/models'

interface AttendanceHistoryItemProps {
  record: AttendanceRecord
}

/**
 * AttendanceHistoryItem renders a single class status log row.
 */
export const AttendanceHistoryItem: React.FC<AttendanceHistoryItemProps> = ({
  record,
}) => {
  const isPresent = record.status === 'Present'

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-surface border border-border-card rounded-large shadow-sm select-none">
      <div className="space-y-1 min-w-0">
        <Typography variant="body" weight="semibold" className="truncate block text-[14px]">
          {formatDate(record.date)}
        </Typography>
        <div className="flex items-center gap-2 text-text-secondary text-[12px] mt-0.5">
          <span>{record.timetableSlot}</span>
          {record.notes && (
            <>
              <span>•</span>
              <span className="italic truncate max-w-[120px] inline-block align-bottom">{record.notes}</span>
            </>
          )}
        </div>
      </div>

      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-pill border font-bold text-[11px] uppercase tracking-wide shrink-0 ${
          isPresent
            ? 'bg-attendance-green/10 border-attendance-green/20 text-attendance-green'
            : 'bg-attendance-red/10 border-attendance-red/20 text-attendance-red'
        }`}
      >
        {isPresent ? (
          <>
            <Check className="w-3.5 h-3.5 stroke-[3px]" />
            <span>Present</span>
          </>
        ) : (
          <>
            <X className="w-3.5 h-3.5 stroke-[3px]" />
            <span>Absent</span>
          </>
        )}
      </div>
    </div>
  )
}

export default AttendanceHistoryItem
