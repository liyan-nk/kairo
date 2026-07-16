import type { Subject, AttendanceRecord } from '../../../lib/models'

export interface ForecastScenario {
  label: string
  percentage: number
  status: 'green' | 'yellow' | 'orange' | 'red'
  statusLabel: string
}

export interface SubjectDetailViewModel {
  subject: Subject
  percentage: number
  status: 'green' | 'yellow' | 'orange' | 'red'
  statusLabel: string
  gapText: string
  recommendedAction: string
  forecastScenarios: ForecastScenario[]
  sortedHistory: AttendanceRecord[]
}

function getStatusForPercentage(pct: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (pct >= 80) return 'green'
  if (pct >= 75) return 'yellow'
  if (pct >= 70) return 'orange'
  return 'red'
}

function getStatusLabelForStatus(status: 'green' | 'yellow' | 'orange' | 'red'): string {
  switch (status) {
    case 'green': return 'Safe'
    case 'yellow': return 'Watch'
    case 'orange': return 'Needs Attention'
    case 'red': return 'Critical'
  }
}

/**
 * Pure function to derive all subject-level detail analytics, gaps, forecasts,
 * actions, and sorted history logs without side effects.
 */
export function deriveSubjectDetailViewModel(
  subject: Subject,
  history: AttendanceRecord[]
): SubjectDetailViewModel {
  const percentage = subject.totalClasses > 0
    ? Math.round((subject.attendedClasses / subject.totalClasses) * 100)
    : 0

  const status = getStatusForPercentage(percentage)
  const statusLabel = getStatusLabelForStatus(status)

  // 1. Calculate gap text and recommended action
  let gapText = ''
  let recommendedAction = ''

  if (percentage >= 75) {
    const maxMisses = Math.max(0, Math.floor(subject.attendedClasses / 0.75 - subject.totalClasses))
    gapText = maxMisses > 0
      ? `Can miss ${maxMisses} class${maxMisses > 1 ? 'es' : ''}`
      : 'Attend next class'

    recommendedAction = maxMisses > 0
      ? `You can safely miss the next ${maxMisses} class${maxMisses > 1 ? 'es' : ''}.`
      : 'Attendance is healthy.'
  } else {
    const reqAttends = Math.max(0, Math.ceil(3 * subject.totalClasses - 4 * subject.attendedClasses))
    gapText = `Must attend ${reqAttends} class${reqAttends > 1 ? 'es' : ''}`
    recommendedAction = 'Attend the next class to return above 75%.'
  }

  // 2. Generate forecast scenarios
  const forecastScenarios: ForecastScenario[] = [
    {
      label: 'Attend next class',
      percentage: Math.min(100, Math.round(((subject.attendedClasses + 1) / (subject.totalClasses + 1)) * 100)),
      status: 'green',
      statusLabel: 'Safe',
    },
    {
      label: 'Miss next class',
      percentage: Math.min(100, Math.round((subject.attendedClasses / (subject.totalClasses + 1)) * 100)),
      status: 'green',
      statusLabel: 'Safe',
    },
    {
      label: 'Attend next 3 classes',
      percentage: Math.min(100, Math.round(((subject.attendedClasses + 3) / (subject.totalClasses + 3)) * 100)),
      status: 'green',
      statusLabel: 'Safe',
    },
  ]

  // Assign correct statuses to scenarios dynamically
  for (const s of forecastScenarios) {
    s.status = getStatusForPercentage(s.percentage)
    s.statusLabel = getStatusLabelForStatus(s.status)
  }

  // 3. Sort history reverse-chronologically
  const sortedHistory = [...history].sort((a, b) => b.date.localeCompare(a.date))

  return {
    subject,
    percentage,
    status,
    statusLabel,
    gapText,
    recommendedAction,
    forecastScenarios,
    sortedHistory,
  }
}
