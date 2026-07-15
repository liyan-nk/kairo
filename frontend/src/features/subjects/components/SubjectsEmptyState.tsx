import React from 'react'
import { AlertCircle, BookOpen } from 'lucide-react'
import EmptyState from '../../../components/EmptyState'

interface SubjectsEmptyStateProps {
  viewState: 'no-subjects' | 'error'
  onRetry?: () => void
}

export const SubjectsEmptyState: React.FC<SubjectsEmptyStateProps> = ({
  viewState,
  onRetry,
}) => {
  if (viewState === 'error') {
    return (
      <EmptyState
        icon={<AlertCircle className="text-brand-danger" />}
        title="Unable to Load Subjects"
        description="Something went wrong. Please check your connection or database access and try again."
        actionLabel="Retry"
        onAction={onRetry}
        className="my-0"
      />
    )
  }

  return (
    <EmptyState
      icon={<BookOpen className="text-brand-info" />}
      title="No Subjects Enrolled"
      description="You haven't enrolled in any subjects yet. Seed mock database entries to begin."
      className="my-0"
    />
  )
}

export default SubjectsEmptyState
