import React from 'react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'

interface AttendanceSummaryCardProps {
  status: string
  percentage: number
}

export const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({
  status,
  percentage,
}) => {
  // Determine color theme based on attendance percentage thresholds
  const getColorClass = (): string => {
    if (percentage >= 85) return 'brand-success'
    if (percentage >= 75) return 'brand-warning'
    return 'brand-danger'
  }

  const color = getColorClass()

  return (
    <Card variant="default" padding="md" className="space-y-3">
      <div className="flex justify-between items-baseline">
        <Typography variant="title" weight="bold" className={`text-${color}`}>
          {status}
        </Typography>
        <Typography variant="title" weight="bold">
          {percentage}%
        </Typography>
      </div>
      {/* Horizontal progress indicator */}
      <div className="w-full h-2 bg-border-card rounded-pill overflow-hidden">
        <div
          className={`h-full bg-${color} rounded-pill`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Card>
  )
}

export default AttendanceSummaryCard
