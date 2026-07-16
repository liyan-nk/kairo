import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Typography from '../../components/Typography'
import Skeleton from '../../components/Skeleton'
import IconButton from '../../components/IconButton'
import { createSubjectRepository } from '../../lib/repositories'
import type { Subject, AttendanceRecord } from '../../lib/models'
import { deriveSubjectDetailViewModel } from './utils/subjectDetailViewModel'
import AttendanceRing from './components/AttendanceRing'
import RiskIndicator from './components/RiskIndicator'
import AttendanceForecastCard from './components/AttendanceForecastCard'
import AttendanceHistoryList from './components/AttendanceHistoryList'

/**
 * Subject Details Page.
 * Displays large progress ring, recommended action gap logs, forecast scenarios,
 * and chronological log lists.
 */
export const SubjectDetailPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>()
  const navigate = useNavigate()
  const repository = useMemo(() => createSubjectRepository(), [])

  const [subject, setSubject] = useState<Subject | null>(null)
  const [history, setHistory] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const [retryTrigger, setRetryTrigger] = useState(0)

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    setRetryTrigger((prev) => prev + 1)
  }

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      if (!subjectId) return
      try {
        const [subData, historyData] = await Promise.all([
          repository.getSubject(subjectId),
          repository.getAttendanceHistory(subjectId),
        ])
        if (active) {
          if (!subData) {
            setHasError(true)
          } else {
            setSubject(subData)
            setHistory(historyData)
          }
          setIsLoading(false)
        }
      } catch {
        if (active) {
          setHasError(true)
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [subjectId, repository, retryTrigger])

  const viewModel = useMemo(() => {
    if (!subject) return null
    return deriveSubjectDetailViewModel(subject, history)
  }, [subject, history])

  const handleBack = () => {
    navigate('/subjects')
  }

  // Loader Skeletons
  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <header className="flex items-center gap-3">
          <Skeleton variant="circular" width="40px" height="40px" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" width="40%" height="24px" />
            <Skeleton variant="text" width="60%" height="16px" />
          </div>
        </header>
        <div className="flex justify-center py-6">
          <Skeleton variant="circular" width="160px" height="160px" />
        </div>
        <Skeleton variant="rectangular" height="96px" className="rounded-large" />
        <Skeleton variant="rectangular" height="144px" className="rounded-large" />
      </div>
    )
  }

  if (hasError || !viewModel) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Typography variant="body" color="secondary" className="text-center">
          Failed to load subject detail.
        </Typography>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-text-primary text-bg rounded-medium text-[14px] font-medium"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200 pb-8">
      {/* Navigation Header */}
      <header className="flex items-start gap-4">
        <IconButton
          icon={<ArrowLeft className="w-5 h-5" />}
          onClick={handleBack}
          aria-label="Back to Subjects"
          className="mt-1 shrink-0"
        />
        <div className="space-y-1 min-w-0">
          <Typography variant="h2" weight="bold" className="truncate">
            {viewModel.subject.name}
          </Typography>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-text-secondary text-[13px]">
            <span className="font-semibold">{viewModel.subject.code}</span>
            <span>•</span>
            <span>{viewModel.subject.faculty}</span>
            <span>•</span>
            <span>{viewModel.subject.room}</span>
          </div>
        </div>
      </header>

      {/* Circular Progress Ring Area */}
      <section className="flex flex-col items-center justify-center p-6 bg-surface border border-border-card rounded-large shadow-sm">
        <AttendanceRing
          percentage={viewModel.percentage}
          status={viewModel.status}
          attended={viewModel.subject.attendedClasses}
          total={viewModel.subject.totalClasses}
        />
      </section>

      {/* Risk Assessment Indicator */}
      <RiskIndicator
        status={viewModel.status}
        statusLabel={viewModel.statusLabel}
        gapText={viewModel.gapText}
        recommendedAction={viewModel.recommendedAction}
      />

      {/* Forecasting Grid */}
      <AttendanceForecastCard scenarios={viewModel.forecastScenarios} />

      {/* Attendance Log Chronological Log */}
      <section className="space-y-3">
        <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
          Attendance History
        </Typography>
        <AttendanceHistoryList history={viewModel.sortedHistory} />
      </section>
    </div>
  )
}

export default SubjectDetailPage
