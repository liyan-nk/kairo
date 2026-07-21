import React from 'react'
import Typography from '../../../components/Typography'

interface TimelineItemProps {
  subject: string
  time: string
  status: 'completed' | 'current' | 'upcoming'
  onEdit?: () => void
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  subject,
  time,
  status,
  onEdit,
}) => {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="space-y-1 min-w-0 pr-2">
        <Typography
          variant="body"
          weight={status === 'current' ? 'semibold' : 'normal'}
          color={status === 'completed' ? 'secondary' : 'primary'}
          className="truncate"
        >
          {subject}
        </Typography>
        <Typography variant="caption" color="secondary">
          {time}
        </Typography>
      </div>
      <div className="shrink-0">
        {status === 'completed' && (
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-pill bg-attendance-green/10 border border-attendance-green/20 text-attendance-green flex items-center gap-1 uppercase tracking-wider">
              ✓ Completed
            </span>
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="text-[12px] font-semibold text-brand-info hover:underline focus:outline-none cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
        )}
        {status === 'current' && (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-pill bg-brand-info/15 border border-brand-info/30 text-brand-info flex items-center gap-1.5 uppercase tracking-wider animate-pulse">
            ● Live
          </span>
        )}
        {status === 'upcoming' && (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-pill bg-surface-secondary border border-border-card text-text-secondary flex items-center gap-1 uppercase tracking-wider">
            ○ Upcoming
          </span>
        )}
      </div>
    </div>
  )
}

export default TimelineItem
