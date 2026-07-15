import React from 'react'
import Typography from '../../../components/Typography'
import Badge from '../../../components/Badge'

interface TimelineItemProps {
  subject: string
  time: string
  status: 'completed' | 'current' | 'upcoming'
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  subject,
  time,
  status,
}) => {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="space-y-1">
        <Typography
          variant="body"
          weight={status === 'current' ? 'semibold' : 'normal'}
          color={status === 'completed' ? 'secondary' : 'primary'}
        >
          {subject}
        </Typography>
        <Typography variant="caption" color="secondary">
          {time}
        </Typography>
      </div>
      <div>
        {status === 'completed' && (
          <Badge variant="filled" color="secondary">
            Completed
          </Badge>
        )}
        {status === 'current' && (
          <Badge variant="filled" color="primary">
            Current
          </Badge>
        )}
        {status === 'upcoming' && (
          <Badge variant="outlined" color="secondary">
            Upcoming
          </Badge>
        )}
      </div>
    </div>
  )
}

export default TimelineItem
