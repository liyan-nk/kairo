import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import Badge from '../../../components/Badge'
import type { TrendDataPoint, TrendStatus } from '../utils/attendanceInsights'

interface AttendanceTrendCardProps {
  weeklyTrend: TrendDataPoint[]
  monthlyTrend: TrendDataPoint[]
  trendStatus: TrendStatus
}

export const AttendanceTrendCard: React.FC<AttendanceTrendCardProps> = ({
  weeklyTrend,
  monthlyTrend,
  trendStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly')
  const activeData = activeTab === 'weekly' ? weeklyTrend : monthlyTrend

  let badgeColor: 'green' | 'info' | 'red' = 'info'
  let IconComponent = Minus

  if (trendStatus === 'improving') {
    badgeColor = 'green'
    IconComponent = TrendingUp
  } else if (trendStatus === 'declining') {
    badgeColor = 'red'
    IconComponent = TrendingDown
  }

  return (
    <Card variant="default" padding="lg" className="space-y-4">
      {/* Header with Trend Badge */}
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <Typography variant="title" weight="bold">
            Attendance Trend
          </Typography>
          <Typography variant="caption" color="secondary">
            Recent attendance rate trajectory
          </Typography>
        </div>
        <Badge variant="filled" color={badgeColor} className="flex items-center gap-1">
          <IconComponent className="w-3.5 h-3.5" />
          <span className="capitalize">{trendStatus}</span>
        </Badge>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-surface-secondary/70 p-1 rounded-medium">
        <button
          type="button"
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-1.5 text-[13px] font-semibold rounded-small transition-all cursor-pointer ${
            activeTab === 'weekly'
              ? 'bg-surface text-text-primary shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Weekly
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('monthly')}
          className={`flex-1 py-1.5 text-[13px] font-semibold rounded-small transition-all cursor-pointer ${
            activeTab === 'monthly'
              ? 'bg-surface text-text-primary shadow-xs'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Trend Visualizer */}
      {activeData.length === 0 ? (
        <div className="py-4 text-center">
          <Typography variant="caption" color="secondary">
            Not enough historical logs to render trend analysis.
          </Typography>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {activeData.map((dp, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-medium text-text-secondary">{dp.label}</span>
                <span className="font-semibold text-text-primary">
                  {dp.rate}% ({dp.attended}/{dp.total})
                </span>
              </div>
              <div className="w-full h-2 bg-surface-secondary border border-border-card/40 rounded-pill overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out ${
                    dp.rate >= 75 ? 'bg-attendance-green' : 'bg-attendance-red'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, dp.rate))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default AttendanceTrendCard
