import React from 'react'
import { Calendar, Clock, Coffee, Sunset, AlertCircle } from 'lucide-react'
import EmptyState from '../../../components/EmptyState'
import type { ViewState } from '../types'

interface TodayEmptyStateProps {
  viewState: ViewState
  onRetry?: () => void
  className?: string
  customTitle?: string
  customDescription?: string
}

export const TodayEmptyState: React.FC<TodayEmptyStateProps> = ({
  viewState,
  onRetry,
  className = '',
  customTitle,
  customDescription,
}) => {
  switch (viewState) {
    case 'error':
      return (
        <EmptyState
          icon={<AlertCircle className="text-brand-danger" />}
          title="Unable to Load Timetable"
          description="Something went wrong. Please check your connection and try again."
          actionLabel="Retry"
          onAction={onRetry}
          className={className}
        />
      )
    case 'holiday':
      return (
        <EmptyState
          icon={<Calendar className="text-brand-info" />}
          title={customTitle || "No classes today."}
          description={customDescription || "Enjoy your weekend."}
          className={className}
        />
      )
    case 'dayEnded':
      return (
        <EmptyState
          icon={<Sunset className="text-brand-info" />}
          title={customTitle || "You're done for today."}
          description={customDescription || "Classes ended for today — have a great evening!"}
          className={className}
        />
      )
    case 'beforeFirst':
      return (
        <EmptyState
          icon={<Clock className="text-brand-info" />}
          title={customTitle || "Morning Schedule"}
          description={customDescription || "Your first class starts soon."}
          className={className}
        />
      )
    case 'freePeriod':
      return (
        <EmptyState
          icon={<Coffee className="text-brand-info" />}
          title={customTitle || "Break / Free Period"}
          description={customDescription || "No class scheduled right now."}
          className={className}
        />
      )
    default:
      return null
  }
}

export default TodayEmptyState
