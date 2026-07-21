import React from 'react'
import { ShieldCheck, AlertTriangle, Activity, TrendingUp } from 'lucide-react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import Badge from '../../../components/Badge'
import type { SemesterInsightsViewModel } from '../utils/attendanceInsightsViewModel'

interface AttendanceHealthCardProps {
  insights: SemesterInsightsViewModel
}

export const AttendanceHealthCard: React.FC<AttendanceHealthCardProps> = ({ insights }) => {
  const { semesterHealth, averageAttendance, safestSubject, riskiestSubject } = insights

  let badgeVariant: 'green' | 'orange' | 'red' = 'green'
  let IconComponent = ShieldCheck

  if (semesterHealth === 'At Risk') {
    badgeVariant = 'orange'
    IconComponent = Activity
  } else if (semesterHealth === 'Critical') {
    badgeVariant = 'red'
    IconComponent = AlertTriangle
  }

  return (
    <Card variant="default" padding="lg" className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <IconComponent className={`w-5 h-5 ${
            semesterHealth === 'Healthy' ? 'text-attendance-green' : (semesterHealth === 'At Risk' ? 'text-brand-warning' : 'text-brand-danger')
          }`} />
          <Typography variant="title" weight="bold">
            Semester Health
          </Typography>
        </div>
        <Badge variant="filled" color={badgeVariant}>
          {semesterHealth}
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3 bg-surface-secondary/60 rounded-medium space-y-1">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Average Attendance
          </Typography>
          <Typography variant="h2" weight="bold" className="text-text-primary">
            {averageAttendance}%
          </Typography>
        </div>

        <div className="p-3 bg-surface-secondary/60 rounded-medium space-y-1">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-attendance-green" />
            Safest Subject
          </Typography>
          {safestSubject ? (
            <div>
              <Typography variant="body" weight="semibold" className="truncate leading-tight">
                {safestSubject.name}
              </Typography>
              <Typography variant="caption" color="secondary">
                {safestSubject.attendancePercentage}% attended
              </Typography>
            </div>
          ) : (
            <Typography variant="caption" color="secondary">
              N/A
            </Typography>
          )}
        </div>
      </div>

      {/* Needs Attention Alert */}
      {riskiestSubject && riskiestSubject.attendancePercentage < 80 && (
        <div className="p-3 bg-brand-warning/10 border border-brand-warning/20 rounded-medium flex items-center justify-between">
          <div className="space-y-0.5 min-w-0 pr-2">
            <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider text-brand-warning">
              Needs Attention
            </Typography>
            <Typography variant="body" weight="semibold" className="truncate">
              {riskiestSubject.name}
            </Typography>
          </div>
          <div className="text-right shrink-0">
            <Typography variant="body" weight="bold" className="text-brand-warning">
              {riskiestSubject.attendancePercentage}%
            </Typography>
          </div>
        </div>
      )}
    </Card>
  )
}

export default AttendanceHealthCard
