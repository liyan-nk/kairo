import type { Subject, AttendanceRecord } from '../../../lib/models'
import {
  calculateWeeklyAttendance,
  calculateMonthlyAttendance,
  calculateAttendanceTrend,
  calculateLongestPresentStreak,
  calculateLongestAbsentStreak,
  calculateCurrentStreak,
  type TrendDataPoint,
  type TrendStatus,
} from './attendanceInsights'

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
