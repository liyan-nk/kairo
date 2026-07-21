import type { Subject } from '../../../lib/models'
import { getStatusForPercentage, getStatusLabelForStatus } from './subjectViewModel'

export interface SimulationResult {
  attendedClasses: number
  totalClasses: number
  percentage: number
  status: 'green' | 'yellow' | 'orange' | 'red'
  statusLabel: string
}

/**
 * Calculates maximum safe leaves student can miss while maintaining >= 75% attendance.
 */
export function calculateSafeLeaves(subject: Pick<Subject, 'attendedClasses' | 'totalClasses'>): number {
  if (subject.totalClasses === 0) return 0
  const pct = subject.attendedClasses / subject.totalClasses
  if (pct < 0.75) return 0
  return Math.max(0, Math.floor(subject.attendedClasses / 0.75 - subject.totalClasses))
}

/**
 * Calculates minimum consecutive attended classes needed to reach >= 75% attendance.
 */
export function calculateRecoveryClasses(subject: Pick<Subject, 'attendedClasses' | 'totalClasses'>): number {
  if (subject.totalClasses === 0) return 0
  const pct = subject.attendedClasses / subject.totalClasses
  if (pct >= 0.75) return 0
  return Math.max(1, Math.ceil(3 * subject.totalClasses - 4 * subject.attendedClasses))
}

/**
 * Pure simulation function calculating projected attendance from attend/miss offsets.
 */
export function simulateAttendance(
  subject: Pick<Subject, 'attendedClasses' | 'totalClasses'>,
  attendOffset: number,
  missOffset: number
): SimulationResult {
  const newAttended = Math.max(0, subject.attendedClasses + Math.max(0, attendOffset))
  const newTotal = Math.max(0, subject.totalClasses + Math.max(0, attendOffset) + Math.max(0, missOffset))
  const percentage = newTotal > 0 ? Math.round((newAttended / newTotal) * 100) : 0
  const status = getStatusForPercentage(percentage)
  const statusLabel = getStatusLabelForStatus(status)

  return {
    attendedClasses: newAttended,
    totalClasses: newTotal,
    percentage,
    status,
    statusLabel,
  }
}
