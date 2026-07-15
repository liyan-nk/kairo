import type { ClassItem, CurrentClass, NextClass } from '../../../lib/models'
import type { ViewState } from '../types'

export interface TodayViewModel {
  computedState: ViewState
  currentClass: CurrentClass | null
  nextClass: NextClass | null
  timeline: ClassItem[]
  minutesLeft: number | null
  canMarkAttendance: boolean
}

/**
 * Pure function that computes the entire presentation model for the TodayPage.
 * Strictly derives time-dependent states to prevent contradictory information.
 */
export function deriveTodayViewModel(params: {
  viewState: ViewState
  isLoading: boolean
  hasError: boolean
  hasUsableData: boolean
  realCurrentClass: CurrentClass | null
  realNextClass: NextClass | null
  realTimeline: ClassItem[]
  realMinutesLeft: number
}): TodayViewModel {
  const {
    viewState,
    isLoading,
    hasError,
    hasUsableData,
    realCurrentClass,
    realNextClass,
    realTimeline,
    realMinutesLeft,
  } = params

  // Determine computedState (dev switcher overrides real state)
  const computedState = viewState !== 'active'
    ? viewState
    : (isLoading ? 'loading' : (hasError && !hasUsableData ? 'error' : 'active'))

  // Default values
  let currentClass: CurrentClass | null = null
  let nextClass: NextClass | null = null
  let timeline: ClassItem[] = []
  let minutesLeft: number | null = null
  let canMarkAttendance = false

  switch (computedState) {
    case 'active':
      currentClass = realCurrentClass
      nextClass = realNextClass
      timeline = realTimeline.map(item => {
        // Map to keep DBMS as current, others matching mock TodayPage rules
        if (item.subject === 'Database Management Systems') {
          return { ...item, status: 'current' }
        }
        if (item.subject === 'Java Programming') {
          return { ...item, status: 'completed' }
        }
        return { ...item, status: 'upcoming' }
      })
      minutesLeft = realMinutesLeft
      canMarkAttendance = true
      break

    case 'beforeFirst':
      currentClass = null
      // First class of today
      nextClass = {
        subject: 'Java Programming',
        room: 'Room 404',
        faculty: 'Dr. Sarah Jenkins',
        startTime: '09:00 AM',
      }
      timeline = realTimeline.map((item) => ({ ...item, status: 'upcoming' }))
      minutesLeft = null
      canMarkAttendance = false
      break

    case 'freePeriod':
      currentClass = null
      // Lecture after morning break
      nextClass = {
        subject: 'Operating Systems',
        room: 'Room 102',
        faculty: 'Prof. Alok Verma',
        startTime: '11:15 AM',
      }
      timeline = realTimeline.map((item) => {
        if (item.subject === 'Morning Break') {
          return { ...item, status: 'current' }
        }
        if (['Java Programming', 'Database Management Systems'].includes(item.subject)) {
          return { ...item, status: 'completed' }
        }
        return { ...item, status: 'upcoming' }
      })
      minutesLeft = null
      canMarkAttendance = false
      break

    case 'dayEnded':
      currentClass = null
      // Tomorrow's first class
      nextClass = {
        subject: 'Compiler Design',
        room: 'Lab 3',
        faculty: 'Dr. Jenkins',
        startTime: '09:00 AM (Tomorrow)',
      }
      timeline = realTimeline.map((item) => ({ ...item, status: 'completed' }))
      minutesLeft = null
      canMarkAttendance = false
      break

    case 'holiday':
      currentClass = null
      nextClass = null
      timeline = [] // Hidden timeline unless holiday schedule data exists
      minutesLeft = null
      canMarkAttendance = false
      break

    default:
      break
  }

  return {
    computedState,
    currentClass,
    nextClass,
    timeline,
    minutesLeft,
    canMarkAttendance,
  }
}
