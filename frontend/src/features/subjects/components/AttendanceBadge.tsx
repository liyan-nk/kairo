import React from 'react'

interface AttendanceBadgeProps {
  status: 'green' | 'yellow' | 'orange' | 'red'
  label: string
}

export const AttendanceBadge: React.FC<AttendanceBadgeProps> = ({
  status,
  label,
}) => {
  const statusColorMap = {
    green: 'border-attendance-green/20 bg-attendance-green/10 text-attendance-green',
    yellow: 'border-attendance-yellow/20 bg-attendance-yellow/10 text-attendance-yellow',
    orange: 'border-attendance-orange/20 bg-attendance-orange/10 text-attendance-orange',
    red: 'border-attendance-red/20 bg-attendance-red/10 text-attendance-red',
  }

  return (
    <span
      className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-pill border tracking-wide uppercase shrink-0 ${statusColorMap[status]}`}
    >
      {label}
    </span>
  )
}

export default AttendanceBadge
