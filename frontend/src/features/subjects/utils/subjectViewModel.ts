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
  proxyBadgeText: string
}

export interface SubjectsViewModel {
  subjects: SubjectItemViewModel[]
  criticalCount: number
  attentionCount: number
  watchCount: number
  safeCount: number
  belowThresholdCount: number
}

export function getStatusForPercentage(percentage: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (percentage >= 80) return 'green'
  if (percentage >= 75) return 'yellow'
  if (percentage >= 70) return 'orange'
  return 'red'
}

export function getStatusLabelForStatus(status: 'green' | 'yellow' | 'orange' | 'red'): string {
  switch (status) {
    case 'green':
      return 'Safe'
    case 'yellow':
      return 'Watch'
    case 'orange':
      return 'Needs Attention'
    case 'red':
      return 'Critical'
  }
}

/**
 * Pure function to derive all attendance health indicators, percentages,
 * warning labels, concise proxy badges, and aggregate stats from canonical subjects list.
 * Sorts subjects by academic risk severity (Critical -> Attention -> Watch -> Safe).
 * Within each category, sorts by distance to the 75% threshold so recoverable items appear first.
 */
export function deriveSubjectsViewModel(subjects: Subject[]): SubjectsViewModel {
  const items = subjects.map((sub) => {
    const { totalClasses, attendedClasses } = sub
    const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0

    const status = getStatusForPercentage(percentage)
    const statusLabel = getStatusLabelForStatus(status)
    let missCountText: string
    let proxyBadgeText: string

    if (percentage >= 80) {
      // Max additional misses allowed to stay >= 75%
      const maxMisses = Math.max(0, Math.floor(attendedClasses / 0.75 - totalClasses))
      missCountText = maxMisses > 0 ? `Can miss ${maxMisses} class${maxMisses > 1 ? 'es' : ''}` : 'Attend next class'
      proxyBadgeText = maxMisses > 0 ? `${maxMisses} Proxies Left` : 'At Threshold'
    } else if (percentage >= 75) {
      missCountText = 'Attend next class'
      proxyBadgeText = 'At Threshold'
    } else if (percentage >= 70) {
      const reqAttends = Math.max(1, Math.ceil(3 * totalClasses - 4 * attendedClasses))
      missCountText = `Must attend ${reqAttends} class${reqAttends > 1 ? 'es' : ''}`
      proxyBadgeText = `Attend ${reqAttends}`
    } else {
      const reqAttends = Math.max(1, Math.ceil(3 * totalClasses - 4 * attendedClasses))
      missCountText = `Must attend ${reqAttends} class${reqAttends > 1 ? 'es' : ''}`
      proxyBadgeText = `Attend ${reqAttends}`
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
      proxyBadgeText,
    }
  })

  // Severity rank mapping
  const severityRank: Record<string, number> = {
    red: 0,
    orange: 1,
    yellow: 2,
    green: 3,
  }

  // Sort by severity tier, then by distance to 75% threshold
  items.sort((a, b) => {
    const rankDiff = severityRank[a.status] - severityRank[b.status]
    if (rankDiff !== 0) return rankDiff

    // Within same severity tier:
    if (a.percentage < 75) {
      // Below 75%: higher percentage first (74% before 73% because 74% is closer to recovery)
      return b.percentage - a.percentage
    } else {
      // Above 75%: lower percentage first (75% before 92% because 75% is closer to threshold)
      return a.percentage - b.percentage
    }
  })

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
