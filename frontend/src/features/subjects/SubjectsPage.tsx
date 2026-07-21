import React from 'react'
import Typography from '../../components/Typography'
import Skeleton from '../../components/Skeleton'
import useSubjects from './hooks/useSubjects'
import { deriveSubjectsViewModel } from './utils/subjectViewModel'
import SubjectsEmptyState from './components/SubjectsEmptyState'
import SubjectList from './components/SubjectList'

/**
 * Subject-centric dashboard displaying enrolled academic course attendance.
 */
export const SubjectsPage: React.FC = () => {
  const { subjects, isLoading, hasError, reload } = useSubjects()

  // Derive unified course presentation metrics
  const viewModel = deriveSubjectsViewModel(subjects)

  // Loading skeleton block
  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <header className="space-y-2">
          <Skeleton variant="text" width="40%" height="28px" />
          <Skeleton variant="text" width="60%" height="16px" />
        </header>
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

  // No enrolled courses view
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
          Track course attendance logs and proxy allowances.
        </Typography>
      </header>

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
