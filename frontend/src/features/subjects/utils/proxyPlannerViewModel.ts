import type { Subject } from '../../../lib/models'
import { calculateSafeLeaves, calculateRecoveryClasses } from './attendanceForecast'
import { getStatusForPercentage, getStatusLabelForStatus } from './subjectViewModel'

export interface ProxyPlannerViewModel {
  percentage: number
  status: 'green' | 'yellow' | 'orange' | 'red'
  statusLabel: string
  canLeaveNow: boolean
  remainingSafeLeaves: number
  recoveryClasses: number
  recommendationTitle: string
  recommendationBody: string
}

/**
 * Derives the canonical Proxy Planner presentation model from a Subject record.
 * This recommendation reflects real database reality and never changes during simulations.
 */
export function deriveProxyPlannerViewModel(subject: Subject): ProxyPlannerViewModel {
  const percentage = subject.totalClasses > 0
    ? Math.round((subject.attendedClasses / subject.totalClasses) * 100)
    : 0

  const status = getStatusForPercentage(percentage)
  const statusLabel = getStatusLabelForStatus(status)
  const remainingSafeLeaves = calculateSafeLeaves(subject)
  const recoveryClasses = calculateRecoveryClasses(subject)
  const canLeaveNow = percentage >= 75 && remainingSafeLeaves > 0

  let recommendationTitle = ''
  let recommendationBody = ''

  if (status === 'green') {
    if (remainingSafeLeaves > 0) {
      recommendationTitle = `You can safely miss ${remainingSafeLeaves} class${remainingSafeLeaves > 1 ? 'es' : ''}`
      recommendationBody = `Your attendance is at ${percentage}%. You have a comfortable safety buffer above 75%.`
    } else {
      recommendationTitle = 'Attend the next class'
      recommendationBody = 'Stay consistent. Missing another class removes your safety buffer.'
    }
  } else if (status === 'yellow') {
    recommendationTitle = 'Stay consistent'
    recommendationBody = 'Missing another class removes your safety buffer and drops you below 75%.'
  } else if (status === 'orange') {
    recommendationTitle = `Attend ${recoveryClasses} consecutive class${recoveryClasses > 1 ? 'es' : ''}`
    recommendationBody = 'Attend the next class to return above the 75% requirement.'
  } else {
    recommendationTitle = `Attend ${recoveryClasses} consecutive class${recoveryClasses > 1 ? 'es' : ''}`
    recommendationBody = `Attend the next ${recoveryClasses} consecutive classes to return above 75%.`
  }

  return {
    percentage,
    status,
    statusLabel,
    canLeaveNow,
    remainingSafeLeaves,
    recoveryClasses,
    recommendationTitle,
    recommendationBody,
  }
}
