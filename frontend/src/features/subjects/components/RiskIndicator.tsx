import React from 'react'
import { AlertCircle, CheckCircle, HelpCircle, ShieldAlert } from 'lucide-react'
import Typography from '../../../components/Typography'

interface RiskIndicatorProps {
  status: 'green' | 'yellow' | 'orange' | 'red'
  statusLabel: string
  gapText: string
  recommendedAction: string
}

/**
 * Alert card displaying current risk level, safety gap, and actions.
 * Dynamic styling maps status to semantic colors.
 */
export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  status,
  statusLabel,
  gapText,
  recommendedAction,
}) => {
  const stylesMap = {
    green: {
      bg: 'bg-attendance-green/10 border-attendance-green/20 text-attendance-green',
      icon: <CheckCircle className="w-5 h-5 shrink-0" />,
    },
    yellow: {
      bg: 'bg-attendance-yellow/10 border-attendance-yellow/20 text-attendance-yellow',
      icon: <HelpCircle className="w-5 h-5 shrink-0" />,
    },
    orange: {
      bg: 'bg-attendance-orange/10 border-attendance-orange/20 text-attendance-orange',
      icon: <ShieldAlert className="w-5 h-5 shrink-0" />,
    },
    red: {
      bg: 'bg-attendance-red/10 border-attendance-red/20 text-attendance-red',
      icon: <AlertCircle className="w-5 h-5 shrink-0" />,
    },
  }

  const currentStyle = stylesMap[status]

  return (
    <div className={`p-4 border rounded-large flex items-start gap-3 shadow-sm select-none ${currentStyle.bg}`}>
      {currentStyle.icon}
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between">
          <Typography variant="body" weight="semibold" className="text-inherit">
            {statusLabel}
          </Typography>
          <span className="text-[12px] font-bold uppercase tracking-wider opacity-90">
            {gapText}
          </span>
        </div>
        <Typography variant="caption" className="text-inherit opacity-85 leading-tight block mt-1">
          {recommendedAction}
        </Typography>
      </div>
    </div>
  )
}

export default RiskIndicator
