import React from 'react'
import { CalendarCheck } from 'lucide-react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'

interface AttendanceSyncCardProps {
  lastSyncDate?: string
  officialBaselinePercentage?: number
}

export const AttendanceSyncCard: React.FC<AttendanceSyncCardProps> = ({
  lastSyncDate,
  officialBaselinePercentage,
}) => {
  return (
    <Card variant="default" padding="lg" className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CalendarCheck className="w-5 h-5 text-brand-info" />
        <div className="space-y-0.5">
          <Typography variant="title" weight="bold">
            Official Sync Baseline
          </Typography>
          <Typography variant="caption" color="secondary">
            Estimations baseline established by the institution
          </Typography>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="p-3 bg-surface-secondary/70 rounded-medium space-y-2 border border-border-card/50">
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-text-secondary font-medium">Last Official Update</span>
          <span className="text-text-primary font-semibold">{lastSyncDate || 'Never updated'}</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-text-secondary font-medium">Official Baseline Attendance</span>
          <span className="text-text-primary font-bold">
            {officialBaselinePercentage !== undefined ? `${officialBaselinePercentage}%` : 'Not initialized'}
          </span>
        </div>
      </div>

      {/* Explanatory text */}
      <Typography variant="caption" color="secondary" className="block leading-relaxed">
        KAIRO estimates daily attendance starting from this official baseline. Manual sync is disabled in V1.
      </Typography>
    </Card>
  )
}

export default AttendanceSyncCard
