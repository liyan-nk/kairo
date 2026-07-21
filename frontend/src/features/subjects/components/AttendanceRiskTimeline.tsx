import React from 'react'
import Typography from '../../../components/Typography'

interface AttendanceRiskTimelineProps {
  currentPercentage: number
  simulatedPercentage?: number | null
}

/**
 * AttendanceRiskTimeline displays a visual spectrum bar with Critical (<70%), Warning (70-75%),
 * and Safe (>=75%) zones, featuring explicit markers for 75% threshold, current position,
 * and optional simulated position.
 */
export const AttendanceRiskTimeline: React.FC<AttendanceRiskTimelineProps> = ({
  currentPercentage,
  simulatedPercentage = null,
}) => {
  const clamp = (val: number) => Math.min(100, Math.max(0, val))
  const currentPos = clamp(currentPercentage)
  const simulatedPos = simulatedPercentage !== null && simulatedPercentage !== undefined ? clamp(simulatedPercentage) : null

  return (
    <div className="p-5 bg-surface border border-border-card rounded-large space-y-4 shadow-sm select-none">
      <div className="flex items-center justify-between">
        <Typography variant="body" weight="semibold">
          Semester Risk Timeline
        </Typography>
        <span className="text-[12px] font-semibold text-text-secondary">
          Threshold: 75%
        </span>
      </div>

      {/* Spectrum Bar Container */}
      <div className="relative pt-6 pb-2">
        {/* Background Zone Spectrum */}
        <div className="h-3.5 w-full rounded-pill overflow-hidden flex bg-surface-secondary border border-border-card/40">
          <div className="w-[70%] bg-attendance-red/20 border-r border-border-card/40" title="Critical (<70%)" />
          <div className="w-[5%] bg-attendance-yellow/30 border-r border-border-card/40" title="Warning (70-75%)" />
          <div className="w-[25%] bg-attendance-green/20" title="Safe (>=75%)" />
        </div>

        {/* 75% Threshold Marker Line */}
        <div
          className="absolute top-4 bottom-1 w-0.5 bg-text-primary z-10"
          style={{ left: '75%' }}
        >
          <span className="absolute -top-5 -translate-x-1/2 text-[10px] font-bold text-text-primary uppercase tracking-wider whitespace-nowrap">
            75% Target
          </span>
        </div>

        {/* Current Position Marker Pin */}
        <div
          className="absolute top-5 -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-300"
          style={{ left: `${currentPos}%` }}
        >
          <span className="text-[11px] font-bold text-text-primary bg-surface border border-border-card px-1.5 py-0.5 rounded-small shadow-sm whitespace-nowrap">
            Current {currentPercentage}%
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-text-primary border-2 border-surface mt-0.5" />
        </div>

        {/* Simulated Position Marker Pin (if active) */}
        {simulatedPos !== null && (
          <div
            className="absolute top-12 -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-300"
            style={{ left: `${simulatedPos}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-brand-info border-2 border-surface mb-0.5 animate-pulse" />
            <span className="text-[11px] font-bold text-white bg-brand-info px-1.5 py-0.5 rounded-small shadow-sm whitespace-nowrap">
              Simulated {simulatedPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className={`flex items-center justify-between pt-2 text-[11px] font-medium text-text-secondary border-t border-border-card/40 ${simulatedPos !== null ? 'mt-6' : ''}`}>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-attendance-red" />
          <span>&lt;70% Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-attendance-yellow" />
          <span>70–75% Warning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-attendance-green" />
          <span>&ge;75% Safe</span>
        </div>
      </div>
    </div>
  )
}

export default AttendanceRiskTimeline
