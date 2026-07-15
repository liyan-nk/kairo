import React from 'react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'

interface CurrentClassCardProps {
  subject: string
  room: string
  faculty: string
  minutesLeft: number
  attendance: 'present' | 'absent' | null
  onMarkAttendance: (status: 'present' | 'absent') => void
  onReportChange: () => void
}

export const CurrentClassCard: React.FC<CurrentClassCardProps> = ({
  subject,
  room,
  faculty,
  minutesLeft,
  attendance,
  onMarkAttendance,
  onReportChange,
}) => {
  return (
    <Card variant="default" padding="lg" className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1 pr-4">
          <Typography variant="title" weight="bold" className="leading-tight">
            {subject}
          </Typography>
          <Typography variant="caption" color="secondary">
            {faculty} · {room}
          </Typography>
        </div>
        <div className="text-right shrink-0">
          <Typography variant="h3" weight="bold" className="text-brand-info leading-none">
            {minutesLeft}m
          </Typography>
          <Typography variant="micro" color="secondary" className="block mt-1">
            remaining
          </Typography>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant={attendance === 'present' ? 'primary' : 'secondary'}
          fullWidth
          onClick={() => onMarkAttendance('present')}
        >
          Present
        </Button>
        <Button
          variant={attendance === 'absent' ? 'danger' : 'secondary'}
          fullWidth
          onClick={() => onMarkAttendance('absent')}
        >
          Absent
        </Button>
      </div>

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
