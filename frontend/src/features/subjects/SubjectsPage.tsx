import React from 'react'
import Typography from '../../components/Typography'
import Skeleton from '../../components/Skeleton'
import useSubjects from './hooks/useSubjects'
import { deriveSubjectsViewModel } from './utils/subjectViewModel'
import SubjectsEmptyState from './components/SubjectsEmptyState'
import AttendanceBadge from './components/AttendanceBadge'
import SubjectList from './components/SubjectList'

/**
 * Mobile-first dashboard layout for academic courses and overall attendance estimation.
 */
export const SubjectsPage: React.FC = () => {
  const { subjects, isLoading, hasError, reload } = useSubjects()

  // Derive unified presentation metrics
  const viewModel = deriveSubjectsViewModel(subjects)

  // Loading skeleton block
  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <header className="space-y-2">
          <Skeleton variant="text" width="40%" height="28px" />
          <Skeleton variant="text" width="60%" height="16px" />
        </header>
        <Skeleton variant="rectangular" height="96px" className="rounded-large" />
        <div className="space-y-4">
          <Skeleton variant="rectangular" height="144px" className="rounded-large" />
          <Skeleton variant="rectangular" height="144px" className="rounded-large" />
          <Skeleton variant="rectangular" height="144px" className="rounded-large" />
        </div>
      </div>
    )
  }

  // Error boundary view
  if (hasError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <SubjectsEmptyState viewState="error" onRetry={reload} />
      </div>
    )
  }

  // No enrolled courses enrolled view
  if (subjects.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <SubjectsEmptyState viewState="no-subjects" />
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Title Header */}
      <header className="space-y-1">
        <Typography variant="h2" weight="bold">
          My Subjects
        </Typography>
        <Typography variant="caption" color="secondary">
          Track course attendance logs and skipped lecture allowances.
        </Typography>
      </header>

      {/* Main Overall Percentage Header summary card */}
      <section className="p-5 bg-surface-secondary border border-border-card rounded-large flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <Typography variant="caption" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Overall Attendance
          </Typography>
          <Typography variant="display" weight="bold" className="leading-none mt-1 block">
            {viewModel.overallPercentage}%
          </Typography>
        </div>
        <AttendanceBadge status={viewModel.overallStatus} label={viewModel.overallStatusLabel} />
      </section>

      {/* Course Cards Grid */}
      <section className="space-y-3">
        <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
          Enrolled Courses
        </Typography>
        <SubjectList subjects={viewModel.subjects} />
      </section>
    </div>
  )
}

export default SubjectsPage
