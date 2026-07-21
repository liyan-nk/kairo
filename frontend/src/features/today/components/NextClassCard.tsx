import React from 'react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'

interface NextClassCardProps {
  subject: string
  room: string
  faculty: string
  startTime: string
  nextCountdownText?: string
}

export const NextClassCard: React.FC<NextClassCardProps> = ({
  subject,
  room,
  faculty,
  startTime,
  nextCountdownText,
}) => {
  return (
    <Card variant="outline" padding="md">
      <div className="flex justify-between items-start">
        <div className="space-y-1 pr-3 min-w-0">
          <Typography variant="title" weight="semibold" className="truncate">
            {subject}
          </Typography>
          <Typography variant="caption" color="secondary">
            {faculty} · {room}
          </Typography>
        </div>
        <div className="text-right shrink-0">
          <Typography variant="body" weight="semibold" className="text-text-primary">
            {nextCountdownText || startTime}
          </Typography>
          <Typography variant="micro" color="secondary" className="block mt-0.5 font-medium">
            {nextCountdownText ? startTime : 'starts'}
          </Typography>
        </div>
      </div>
    </Card>
  )
}

export default NextClassCard
