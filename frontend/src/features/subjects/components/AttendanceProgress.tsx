import React from 'react'

interface AttendanceProgressProps {
  percentage: number
  status: 'green' | 'yellow' | 'orange' | 'red'
}

export const AttendanceProgress: React.FC<AttendanceProgressProps> = ({
  percentage,
  status,
}) => {
  const statusColorMap = {
    green: 'bg-attendance-green',
    yellow: 'bg-attendance-yellow',
    orange: 'bg-attendance-orange',
    red: 'bg-attendance-red',
  }

  return (
    <div className="w-full h-1.5 bg-surface-secondary border border-border-card rounded-pill overflow-hidden">
      <div
        className={`h-full ${statusColorMap[status]} transition-all duration-300`}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  )
}

export default AttendanceProgress
