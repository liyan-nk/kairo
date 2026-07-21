import React, { useMemo } from 'react'
import Typography from '../../components/Typography'
import Skeleton from '../../components/Skeleton'
import useSubjects from './hooks/useSubjects'
import { deriveSubjectsViewModel } from './utils/subjectViewModel'
import { deriveSemesterInsightsViewModel } from './utils/attendanceInsightsViewModel'
import SubjectsEmptyState from './components/SubjectsEmptyState'
import SubjectList from './components/SubjectList'
import AttendanceHealthCard from './components/AttendanceHealthCard'

/**
 * Mobile-first dashboard layout for academic courses and overall attendance estimation.
 */
export const SubjectsPage: React.FC = () => {
  const { subjects, isLoading, hasError, reload } = useSubjects()

  // Derive unified presentation metrics
  const viewModel = deriveSubjectsViewModel(subjects)
  const semesterInsights = useMemo(() => deriveSemesterInsightsViewModel(subjects), [subjects])

  // Loading skeleton block
  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <header className="space-y-2">
          <Skeleton variant="text" width="40%" height="28px" />
          <Skeleton variant="text" width="60%" height="16px" />
        </header>
        <Skeleton variant="rectangular" height="112px" className="rounded-large" />
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
      <section className="p-5 bg-surface border border-border-card rounded-large space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border-card pb-3">
          <Typography variant="body" weight="semibold">
            Attendance Summary
          </Typography>
          {viewModel.belowThresholdCount > 0 ? (
            <span className="px-2.5 py-1 rounded-pill bg-attendance-red/10 border border-attendance-red/20 text-attendance-red text-[11px] font-bold uppercase tracking-wider">
              {viewModel.belowThresholdCount} Below 75%
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-pill bg-attendance-green/10 border border-attendance-green/20 text-attendance-green text-[11px] font-bold uppercase tracking-wider">
              All subjects healthy — Enjoy your proxies 🎉
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="space-y-1">
            <Typography variant="caption" color="secondary" weight="medium">Critical</Typography>
            <Typography variant="h3" weight="bold" className="text-attendance-red block">
              {viewModel.criticalCount}
            </Typography>
          </div>
          <div className="space-y-1">
            <Typography variant="caption" color="secondary" weight="medium">Attention</Typography>
            <Typography variant="h3" weight="bold" className="text-attendance-orange block">
              {viewModel.attentionCount}
            </Typography>
          </div>
          <div className="space-y-1">
            <Typography variant="caption" color="secondary" weight="medium">Watch</Typography>
            <Typography variant="h3" weight="bold" className="text-attendance-yellow block">
              {viewModel.watchCount}
            </Typography>
          </div>
          <div className="space-y-1">
            <Typography variant="caption" color="secondary" weight="medium">Safe</Typography>
            <Typography variant="h3" weight="bold" className="text-attendance-green block">
              {viewModel.safeCount}
            </Typography>
          </div>
        </div>
      </section>

      {/* Semester Health Analytics */}
      <AttendanceHealthCard insights={semesterInsights} />

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
