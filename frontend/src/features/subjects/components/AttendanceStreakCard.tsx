import React from 'react'
import { Flame, AlertCircle, Award } from 'lucide-react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'

interface AttendanceStreakCardProps {
  longestPresentStreak: number
  longestAbsentStreak: number
  currentStreakType: 'Present' | 'Absent' | 'None'
  currentStreakCount: number
}

export const AttendanceStreakCard: React.FC<AttendanceStreakCardProps> = ({
  longestPresentStreak,
  longestAbsentStreak,
  currentStreakType,
  currentStreakCount,
}) => {
  return (
    <Card variant="default" padding="lg" className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-brand-info" />
        <Typography variant="title" weight="bold">
          Streak Intelligence
        </Typography>
      </div>

      {/* Active Streak Banner */}
      <div className="p-3 bg-surface-secondary/70 rounded-medium flex items-center justify-between">
        <div className="space-y-0.5">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Current Active Streak
          </Typography>
          <Typography variant="body" weight="bold" className="flex items-center gap-1.5">
            {currentStreakType === 'Present' && (
              <>
                <Flame className="w-4 h-4 text-attendance-green fill-attendance-green/20" />
                <span className="text-attendance-green">{currentStreakCount} Classes Attended</span>
              </>
            )}
            {currentStreakType === 'Absent' && (
              <>
                <AlertCircle className="w-4 h-4 text-attendance-red" />
                <span className="text-attendance-red">{currentStreakCount} Classes Missed</span>
              </>
            )}
            {currentStreakType === 'None' && (
              <span className="text-text-secondary">No recorded streak</span>
            )}
          </Typography>
        </div>
      </div>

      {/* Record Streaks Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3 bg-attendance-green/10 border border-attendance-green/20 rounded-medium space-y-1">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider text-attendance-green flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            Best Present Streak
          </Typography>
          <Typography variant="h3" weight="bold" className="text-attendance-green">
            {longestPresentStreak} {longestPresentStreak === 1 ? 'Class' : 'Classes'}
          </Typography>
        </div>

        <div className="p-3 bg-attendance-red/10 border border-attendance-red/20 rounded-medium space-y-1">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider text-attendance-red">
            Max Absent Streak
          </Typography>
          <Typography variant="h3" weight="bold" className="text-attendance-red">
            {longestAbsentStreak} {longestAbsentStreak === 1 ? 'Class' : 'Classes'}
          </Typography>
        </div>
      </div>
    </Card>
  )
}

export default AttendanceStreakCard
