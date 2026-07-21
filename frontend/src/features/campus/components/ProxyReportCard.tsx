import React from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import Badge from '../../../components/Badge'
import Button from '../../../components/Button'
import type { ProxyReport } from '../../../lib/models'

interface ProxyReportCardProps {
  report: ProxyReport
  onVerify: (id: string) => void
}

export const ProxyReportCard: React.FC<ProxyReportCardProps> = ({ report, onVerify }) => {
  const getBadgeColor = (status: ProxyReport['status']) => {
    switch (status) {
      case 'Pending':
        return 'secondary'
      case 'Likely':
        return 'info'
      case 'Verified':
        return 'green'
      case 'Auto Accepted':
        return 'primary'
      default:
        return 'secondary'
    }
  }

  return (
    <Card variant="default" padding="lg" className="space-y-3">
      {/* Header with Consensus Badge */}
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-0.5">
          <Typography variant="caption" color="secondary" weight="semibold">
            Today • {report.timetableSlotId === '1' ? '09:00 AM' : report.timetableSlotId === '2' ? '10:00 AM' : report.timetableSlotId === '3' ? '11:15 AM' : '12:15 PM'}
          </Typography>
        </div>
        <Badge variant="filled" color={getBadgeColor(report.status)}>
          {report.status}
        </Badge>
      </div>

      {/* Discrepancy Flow */}
      <div className="flex items-center gap-3 p-3 bg-surface-secondary/70 rounded-medium border border-border-card/50">
        <div className="flex-1 min-w-0">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Expected
          </Typography>
          <Typography variant="body" weight="semibold" className="truncate text-text-secondary line-through">
            {report.expectedSubject}
          </Typography>
        </div>
        <ArrowRight className="w-4 h-4 text-text-secondary shrink-0" />
        <div className="flex-1 min-w-0">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Reported
          </Typography>
          <Typography variant="body" weight="bold" className="truncate text-text-primary">
            {report.actualSubject}
          </Typography>
        </div>
      </div>

      {/* Details Footer */}
      <div className="flex justify-between items-center pt-1 text-[13px] text-text-secondary">
        <div>
          Room: <span className="font-semibold text-text-primary">{report.room}</span> • Faculty: <span className="font-semibold text-text-primary">{report.faculty}</span>
        </div>
        <div className="font-medium">
          {report.reportCount} {report.reportCount === 1 ? 'report' : 'reports'}
        </div>
      </div>

      {/* Verification Action */}
      {report.status !== 'Auto Accepted' && (
        <div className="pt-2 border-t border-border-card/40 flex justify-end">
          <Button
            variant="secondary"
            onClick={() => onVerify(report.id)}
            className="flex items-center gap-1.5 h-[36px] px-3 text-[13px]"
          >
            <CheckCircle2 className="w-4 h-4 text-brand-info" />
            <span>Confirm Discrepancy</span>
          </Button>
        </div>
      )}
    </Card>
  )
}

export default ProxyReportCard
