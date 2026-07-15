import React from 'react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'

interface NextClassCardProps {
  subject: string
  room: string
  faculty: string
  startTime: string
}

export const NextClassCard: React.FC<NextClassCardProps> = ({
  subject,
  room,
  faculty,
  startTime,
}) => {
  return (
    <Card variant="outline" padding="md">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Typography variant="title" weight="semibold">
            {subject}
          </Typography>
          <Typography variant="caption" color="secondary">
            {faculty} · {room}
          </Typography>
        </div>
        <div className="text-right shrink-0">
          <Typography variant="body" weight="semibold" className="text-text-primary">
            {startTime}
          </Typography>
          <Typography variant="micro" color="secondary" className="block mt-0.5">
            starts
          </Typography>
        </div>
      </div>
    </Card>
  )
}

export default NextClassCard
