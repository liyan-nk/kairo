import type { Subject, AttendanceRecord } from '../../../lib/models'

export type TrendStatus = 'improving' | 'stable' | 'declining'
export type SemesterHealthStatus = 'Healthy' | 'At Risk' | 'Critical'

export interface TrendDataPoint {
  label: string
  rate: number
  attended: number
  total: number
}

export interface StreakInfo {
  type: 'Present' | 'Absent' | 'None'
  count: number
}

/**
 * Pure calculation engine for attendance trends, streaks, risk scores, and semester health metrics.
 */

/**
 * Computes weekly attendance rate trend over past N weeks from attendance history.
 */
export function calculateWeeklyAttendance(
  history: AttendanceRecord[],
  numWeeks = 4
): TrendDataPoint[] {
  if (!history || history.length === 0) return []

  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const weeks: { [key: string]: { attended: number; total: number } } = {}

  sorted.forEach((record) => {
    const d = new Date(record.date)
    // Compute week start (Monday)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(d.setDate(diff))
    const weekKey = monday.toISOString().split('T')[0]

    if (!weeks[weekKey]) {
      weeks[weekKey] = { attended: 0, total: 0 }
    }
    weeks[weekKey].total += 1
    if (record.status === 'Present') {
      weeks[weekKey].attended += 1
    }
  })

  const entries = Object.entries(weeks).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
  const recentEntries = entries.slice(-numWeeks)

  return recentEntries.map(([dateStr, data], index) => {
    const rate = data.total > 0 ? Math.round((data.attended / data.total) * 100) : 0
    return {
      label: `W${index + 1} (${dateStr.slice(5)})`,
      rate,
      attended: data.attended,
      total: data.total,
    }
  })
}

/**
 * Computes monthly attendance rate trend over past N months from attendance history.
 */
export function calculateMonthlyAttendance(
  history: AttendanceRecord[],
  numMonths = 3
): TrendDataPoint[] {
  if (!history || history.length === 0) return []

  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const months: { [key: string]: { attended: number; total: number } } = {}

  sorted.forEach((record) => {
    const monthKey = record.date.slice(0, 7) // YYYY-MM
    if (!months[monthKey]) {
      months[monthKey] = { attended: 0, total: 0 }
    }
    months[monthKey].total += 1
    if (record.status === 'Present') {
      months[monthKey].attended += 1
    }
  })

  const entries = Object.entries(months).sort((a, b) => a[0].localeCompare(b[0]))
  const recentEntries = entries.slice(-numMonths)

  return recentEntries.map(([monthKey, data]) => {
    const date = new Date(`${monthKey}-01`)
    const label = date.toLocaleString('default', { month: 'short' })
    const rate = data.total > 0 ? Math.round((data.attended / data.total) * 100) : 0
    return {
      label,
      rate,
      attended: data.attended,
      total: data.total,
    }
  })
}

/**
 * Computes attendance trend status ('improving', 'stable', 'declining') by comparing recent records against older ones.
 */
export function calculateAttendanceTrend(history: AttendanceRecord[]): TrendStatus {
  if (!history || history.length < 4) return 'stable'

  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const midpoint = Math.floor(sorted.length / 2)
  const older = sorted.slice(0, midpoint)
  const recent = sorted.slice(midpoint)

  const olderRate = older.filter((r) => r.status === 'Present').length / older.length
  const recentRate = recent.filter((r) => r.status === 'Present').length / recent.length

  const diff = recentRate - olderRate
  if (diff > 0.05) return 'improving'
  if (diff < -0.05) return 'declining'
  return 'stable'
}

/**
 * Computes longest consecutive Present streak.
 */
export function calculateLongestPresentStreak(history: AttendanceRecord[]): number {
  if (!history || history.length === 0) return 0
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  let maxStreak = 0
  let currentStreak = 0

  sorted.forEach((record) => {
    if (record.status === 'Present') {
      currentStreak += 1
      if (currentStreak > maxStreak) maxStreak = currentStreak
    } else {
      currentStreak = 0
    }
  })

  return maxStreak
}

/**
 * Computes longest consecutive Absent streak.
 */
export function calculateLongestAbsentStreak(history: AttendanceRecord[]): number {
  if (!history || history.length === 0) return 0
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  let maxStreak = 0
  let currentStreak = 0

  sorted.forEach((record) => {
    if (record.status === 'Absent') {
      currentStreak += 1
      if (currentStreak > maxStreak) maxStreak = currentStreak
    } else {
      currentStreak = 0
    }
  })

  return maxStreak
}

/**
 * Computes active current streak (Present or Absent) and count.
 */
export function calculateCurrentStreak(history: AttendanceRecord[]): StreakInfo {
  if (!history || history.length === 0) return { type: 'None', count: 0 }
  const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const activeType = sorted[0].status
  let count = 0

  for (const record of sorted) {
    if (record.status === activeType) {
      count += 1
    } else {
      break
    }
  }

  return { type: activeType, count }
}

/**
 * Calculates risk score for a subject (0 = low risk, 100 = high risk/critical).
 */
export function calculateRiskScore(subject: Subject): number {
  if (!subject || subject.totalClasses === 0) return 0
  const percentage = (subject.attendedClasses / subject.totalClasses) * 100
  if (percentage >= 85) return 10
  if (percentage >= 75) return 40
  if (percentage >= 65) return 75
  return 100
}
