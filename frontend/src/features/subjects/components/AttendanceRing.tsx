import React from 'react'

interface AttendanceRingProps {
  percentage: number
  status: 'green' | 'yellow' | 'orange' | 'red'
  attended: number
  total: number
}

/**
 * Circular progress ring representing attendance percentage.
 * Completely visual, consuming computed view model values.
 */
export const AttendanceRing: React.FC<AttendanceRingProps> = ({
  percentage,
  status,
  attended,
  total,
}) => {
  const radius = 60
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const strokeColorMap = {
    green: 'stroke-attendance-green',
    yellow: 'stroke-attendance-yellow',
    orange: 'stroke-attendance-orange',
    red: 'stroke-attendance-red',
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3 select-none">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* SVG Progress Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-border-card/30 stroke-border-card/30"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${strokeColorMap[status]} transition-all duration-500 ease-out`}
          />
        </svg>

        {/* Center Text Block */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
          <span className="text-[36px] font-bold tracking-tight text-text-primary leading-none">
            {percentage}%
          </span>
          <span className="text-[12px] font-medium text-text-secondary mt-1 block">
            {attended} / {total} classes
          </span>
        </div>
      </div>
    </div>
  )
}

export default AttendanceRing
