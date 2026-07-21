import React from 'react'
import { RefreshCw, CalendarCheck } from 'lucide-react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'

interface AttendanceSyncCardProps {
  lastSyncDate?: string
  officialBaselinePercentage?: number
  onSyncTrigger: () => void
}

export const AttendanceSyncCard: React.FC<AttendanceSyncCardProps> = ({
  lastSyncDate,
  officialBaselinePercentage,
  onSyncTrigger,
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
            Sync daily estimations against college baseline
          </Typography>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="p-3 bg-surface-secondary/70 rounded-medium space-y-2 border border-border-card/50">
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-text-secondary font-medium">Last Sync Date</span>
          <span className="text-text-primary font-semibold">{lastSyncDate || 'Never synced'}</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-text-secondary font-medium">Baseline Percentage</span>
          <span className="text-text-primary font-bold">
            {officialBaselinePercentage !== undefined ? `${officialBaselinePercentage}%` : 'Not initialized'}
          </span>
        </div>
      </div>

      {/* Sync Trigger Button */}
      <Button
        variant="primary"
        fullWidth
        onClick={onSyncTrigger}
        className="flex items-center justify-center gap-1.5 h-[48px]"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Sync Official Attendance</span>
      </Button>
    </Card>
  )
}

export default AttendanceSyncCard
