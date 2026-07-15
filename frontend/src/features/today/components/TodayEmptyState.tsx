import React from 'react'
import { Calendar, Clock, Coffee, Sunset, AlertCircle } from 'lucide-react'
import EmptyState from '../../../components/EmptyState'
import type { ViewState } from '../types'

interface TodayEmptyStateProps {
  viewState: ViewState
  onRetry?: () => void
  className?: string
}

export const TodayEmptyState: React.FC<TodayEmptyStateProps> = ({
  viewState,
  onRetry,
  className = '',
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
          title="No Classes Scheduled"
          description="Enjoy your day off!"
          className={className}
        />
      )
    case 'dayEnded':
      return (
        <EmptyState
          icon={<Sunset className="text-brand-info" />}
          title="Classes Ended"
          description="Classes ended for today — have a great evening!"
          className={className}
        />
      )
    case 'beforeFirst':
      return (
        <EmptyState
          icon={<Clock className="text-brand-info" />}
          title="Morning Schedule"
          description="Your first class starts at 9:00 AM."
          className={className}
        />
      )
    case 'freePeriod':
      return (
        <EmptyState
          icon={<Coffee className="text-brand-info" />}
          title="No Class Right Now"
          description="Your next class starts at 11:15 AM."
          className={className}
        />
      )
    default:
      return null
  }
}

export default TodayEmptyState
