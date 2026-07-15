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
  overallPercentage: number
  overallStatus: 'green' | 'yellow' | 'orange' | 'red'
  overallStatusLabel: string
}

/**
 * Pure function to derive all attendance health indicators, percentages,
 * warning labels, and aggregate stats from canonical subjects list.
 */
export function deriveSubjectsViewModel(subjects: Subject[]): SubjectsViewModel {
  let totalAttended = 0
  let totalScheduled = 0

  const items = subjects.map((sub) => {
    const { totalClasses, attendedClasses } = sub
    const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0
    
    totalAttended += attendedClasses
    totalScheduled += totalClasses

    let status: 'green' | 'yellow' | 'orange' | 'red' = 'red'
    let statusLabel = 'Critical'
    let missCountText = ''

    if (percentage >= 80) {
      status = 'green'
      statusLabel = 'Safe'
      // Max additional misses allowed to stay >= 75%
      const maxMisses = Math.max(0, Math.floor(attendedClasses / 0.75 - totalClasses))
      missCountText = maxMisses > 0 ? `Can miss ${maxMisses} class${maxMisses > 1 ? 'es' : ''}` : 'Attend next class'
    } else if (percentage >= 75) {
      status = 'yellow'
      statusLabel = 'Watch Carefully'
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

  const overallPercentage = totalScheduled > 0 ? Math.round((totalAttended / totalScheduled) * 100) : 0
  let overallStatus: 'green' | 'yellow' | 'orange' | 'red' = 'red'
  let overallStatusLabel = 'Critical'

  if (overallPercentage >= 80) {
    overallStatus = 'green'
    overallStatusLabel = 'Comfortable'
  } else if (overallPercentage >= 75) {
    overallStatus = 'yellow'
    overallStatusLabel = 'Watch carefully'
  } else if (overallPercentage >= 70) {
    overallStatus = 'orange'
    overallStatusLabel = 'Needs attention'
  } else {
    overallStatus = 'red'
    overallStatusLabel = 'Critical'
  }

  return {
    subjects: items,
    overallPercentage,
    overallStatus,
    overallStatusLabel,
  }
}
