import type { Subject } from '../../../lib/models'

export interface SubjectItemViewModel {
  id: string
  code: string
  name: string
  faculty: string
  room: string
  totalClasses: number
  attendedClasses: number
  percentage: number
  status: 'green' | 'yellow' | 'orange' | 'red'
  statusLabel: string
  missCountText: string
}

export interface SubjectsViewModel {
  subjects: SubjectItemViewModel[]
  criticalCount: number
  attentionCount: number
  watchCount: number
  safeCount: number
  belowThresholdCount: number
}

/**
 * Pure function to derive all attendance health indicators, percentages,
 * warning labels, and aggregate stats from canonical subjects list.
 * Sorts subjects by academic risk severity (Critical -> Attention -> Watch -> Safe).
 */
export function deriveSubjectsViewModel(subjects: Subject[]): SubjectsViewModel {
  const items = subjects.map((sub) => {
    const { totalClasses, attendedClasses } = sub
    const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0

    let status: 'green' | 'yellow' | 'orange' | 'red'
    let statusLabel: string
    let missCountText: string

    if (percentage >= 80) {
      status = 'green'
      statusLabel = 'Safe'
      // Max additional misses allowed to stay >= 75%
      const maxMisses = Math.max(0, Math.floor(attendedClasses / 0.75 - totalClasses))
      missCountText = maxMisses > 0 ? `Can miss ${maxMisses} class${maxMisses > 1 ? 'es' : ''}` : 'Attend next class'
    } else if (percentage >= 75) {
      status = 'yellow'
      statusLabel = 'Watch'
      missCountText = 'Attend next class'
    } else if (percentage >= 70) {
      status = 'orange'
      statusLabel = 'Needs Attention'
      const reqAttends = Math.max(0, Math.ceil(3 * totalClasses - 4 * attendedClasses))
      missCountText = `Must attend ${reqAttends} class${reqAttends > 1 ? 'es' : ''}`
    } else {
      status = 'red'
      statusLabel = 'Critical'
      const reqAttends = Math.max(0, Math.ceil(3 * totalClasses - 4 * attendedClasses))
      missCountText = `Must attend ${reqAttends} class${reqAttends > 1 ? 'es' : ''}`
    }

    return {
      id: sub.id,
      code: sub.code,
      name: sub.name,
      faculty: sub.faculty,
      room: sub.room,
      totalClasses,
      attendedClasses,
      percentage,
      status,
      statusLabel,
      missCountText,
    }
  })

  // Severity prioritization mapping: Critical (red) -> Needs Attention (orange) -> Watch (yellow) -> Safe (green)
  const severityRank = {
    red: 0,
    orange: 1,
    yellow: 2,
    green: 3,
  }

  // Sort subjects by severity
  items.sort((a, b) => severityRank[a.status] - severityRank[b.status])

  // Calculate status counts
  const criticalCount = items.filter((item) => item.status === 'red').length
  const attentionCount = items.filter((item) => item.status === 'orange').length
  const watchCount = items.filter((item) => item.status === 'yellow').length
  const safeCount = items.filter((item) => item.status === 'green').length
  const belowThresholdCount = items.filter((item) => item.percentage < 75).length

  return {
    subjects: items,
    criticalCount,
    attentionCount,
    watchCount,
    safeCount,
    belowThresholdCount,
  }
}
