import React from 'react'
import Typography from '../../../components/Typography'
import type { ForecastScenario } from '../utils/subjectDetailViewModel'

interface AttendanceForecastCardProps {
  scenarios: ForecastScenario[]
}

/**
 * Attendance Forecasting card displaying forecast scenario calculations.
 */
export const AttendanceForecastCard: React.FC<AttendanceForecastCardProps> = ({
  scenarios,
}) => {
  const dotColorMap = {
    green: 'bg-attendance-green',
    yellow: 'bg-attendance-yellow',
    orange: 'bg-attendance-orange',
    red: 'bg-attendance-red',
  }

  const textColorMap = {
    green: 'text-attendance-green',
    yellow: 'text-attendance-yellow',
    orange: 'text-attendance-orange',
    red: 'text-attendance-red',
  }

  return (
    <div className="p-5 bg-surface border border-border-card rounded-large space-y-4 shadow-sm select-none">
      <Typography variant="body" weight="semibold">
        Attendance Projection
      </Typography>

      <div className="space-y-3">
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-1 border-b border-border-card/50 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dotColorMap[scenario.status]}`} />
              <Typography variant="body" color="secondary" className="text-[14px]">
                {scenario.label}
              </Typography>
            </div>
            <div className="flex items-baseline gap-1.5">
              <Typography variant="title" weight="bold" className={`${textColorMap[scenario.status]} text-[18px]`}>
                {scenario.percentage}%
              </Typography>
              <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                {scenario.statusLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AttendanceForecastCard
