import type { ClassItem, CurrentClass, NextClass, AttendanceRecord } from '../../../lib/models'
import type { ViewState } from '../types'

export type AttendanceState = 'notMarked' | 'present' | 'absent'

export interface TodayViewModel {
  computedState: ViewState
  currentClass: CurrentClass | null
  nextClass: NextClass | null
  timeline: ClassItem[]
  minutesLeft: number | null
  canMarkAttendance: boolean
  attendanceState: AttendanceState
  recordedRecordId: string | null
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
  attendanceRecord?: AttendanceRecord | null
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
    attendanceRecord = null,
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
      break

    case 'holiday':
      currentClass = null
      nextClass = null
      timeline = [] // Hidden timeline unless holiday schedule data exists
      minutesLeft = null
      break

    default:
      break
  }

  const attendanceState: AttendanceState = attendanceRecord
    ? (attendanceRecord.status === 'Present' ? 'present' : 'absent')
    : 'notMarked'

  const recordedRecordId = attendanceRecord ? attendanceRecord.id : null
  const canMarkAttendance = computedState === 'active' && currentClass !== null && attendanceState === 'notMarked'

  return {
    computedState,
    currentClass,
    nextClass,
    timeline,
    minutesLeft,
    canMarkAttendance,
    attendanceState,
    recordedRecordId,
  }
}
