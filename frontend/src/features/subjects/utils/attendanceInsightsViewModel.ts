import type { Subject, AttendanceRecord } from '../../../lib/models'
import {
  calculateSemesterHealth,
  calculateWeeklyAttendance,
  calculateMonthlyAttendance,
  calculateAttendanceTrend,
  calculateLongestPresentStreak,
  calculateLongestAbsentStreak,
  calculateCurrentStreak,
  type TrendDataPoint,
  type TrendStatus,
} from './attendanceInsights'

export interface SubjectInsightSummary {
  id: string
  name: string
  code: string
  attendancePercentage: number
  status: 'safe' | 'watch' | 'attention' | 'critical'
}

export interface SemesterInsightsViewModel {
  semesterHealth: 'Healthy' | 'At Risk' | 'Critical'
  healthScore: number
  averageAttendance: number
  safestSubject: SubjectInsightSummary | null
  riskiestSubject: SubjectInsightSummary | null
  improvingSubjects: SubjectInsightSummary[]
  decliningSubjects: SubjectInsightSummary[]
}

export interface SubjectInsightsViewModel {
  weeklyTrend: TrendDataPoint[]
  monthlyTrend: TrendDataPoint[]
  trendStatus: TrendStatus
  longestPresentStreak: number
  longestAbsentStreak: number
  currentStreakType: 'Present' | 'Absent' | 'None'
  currentStreakCount: number
}

/**
 * Pure helper converting domain Subject entity to presentation-ready SubjectInsightSummary.
 */
function mapSubjectToSummary(subject: Subject): SubjectInsightSummary {
  const percentage = subject.totalClasses > 0 ? Math.round((subject.attendedClasses / subject.totalClasses) * 100) : 100
  let status: 'safe' | 'watch' | 'attention' | 'critical' = 'safe'
  if (percentage < 75) {
    status = 'critical'
  } else if (percentage < 80) {
    status = 'attention'
  } else if (percentage < 85) {
    status = 'watch'
  }

  return {
    id: subject.id,
    name: subject.name,
    code: subject.code,
    attendancePercentage: percentage,
    status,
  }
}

/**
 * Derives semester-wide attendance insights view model from canonical subjects and histories.
 */
export function deriveSemesterInsightsViewModel(
  subjects: Subject[],
  historiesMap?: Map<string, AttendanceRecord[]>
): SemesterInsightsViewModel {
  const { semesterHealth, healthScore, averageAttendance } = calculateSemesterHealth(subjects)

  if (!subjects || subjects.length === 0) {
    return {
      semesterHealth,
      healthScore,
      averageAttendance,
      safestSubject: null,
      riskiestSubject: null,
      improvingSubjects: [],
      decliningSubjects: [],
    }
  }

  const sortedByPct = [...subjects].sort((a, b) => {
    const pctA = a.totalClasses > 0 ? a.attendedClasses / a.totalClasses : 1
    const pctB = b.totalClasses > 0 ? b.attendedClasses / b.totalClasses : 1
    return pctB - pctA
  })

  const safestSubject = mapSubjectToSummary(sortedByPct[0])
  const riskiestSubject = mapSubjectToSummary(sortedByPct[sortedByPct.length - 1])

  const improvingSubjects: SubjectInsightSummary[] = []
  const decliningSubjects: SubjectInsightSummary[] = []

  if (historiesMap) {
    subjects.forEach((subject) => {
      const history = historiesMap.get(subject.id) || []
      const trend = calculateAttendanceTrend(history)
      if (trend === 'improving') {
        improvingSubjects.push(mapSubjectToSummary(subject))
      } else if (trend === 'declining') {
        decliningSubjects.push(mapSubjectToSummary(subject))
      }
    })
  }

  return {
    semesterHealth,
    healthScore,
    averageAttendance,
    safestSubject,
    riskiestSubject,
    improvingSubjects,
    decliningSubjects,
  }
}

/**
 * Derives subject-specific analytics view model for SubjectDetailPage.
 */
export function deriveSubjectInsightsViewModel(
  _subject: Subject,
  history: AttendanceRecord[]
): SubjectInsightsViewModel {
  const weeklyTrend = calculateWeeklyAttendance(history)
  const monthlyTrend = calculateMonthlyAttendance(history)
  const trendStatus = calculateAttendanceTrend(history)
  const longestPresentStreak = calculateLongestPresentStreak(history)
  const longestAbsentStreak = calculateLongestAbsentStreak(history)
  const streak = calculateCurrentStreak(history)

  return {
    weeklyTrend,
    monthlyTrend,
    trendStatus,
    longestPresentStreak,
    longestAbsentStreak,
    currentStreakType: streak.type,
    currentStreakCount: streak.count,
  }
}
