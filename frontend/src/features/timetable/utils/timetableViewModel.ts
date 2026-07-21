import type { ClassItem, CurrentClass, NextClass } from '../../../lib/models'
import {
  getDayStatus,
  getCurrentClassSlot,
  getNextClassSlot,
  getCurrentProgress,
  getRemainingTime,
  getParsedSlots,
  getMinutesFromMidnight,
  formatMinutesTo12HourTime,
  type DayStatus,
} from './liveSchedule'

export interface ScheduleState {
  type: 'current' | 'break' | 'finished' | 'empty'
  slot?: ClassItem
  nextSlot?: ClassItem
  message: string
}

export interface TimetableViewModel {
  scheduleState: ScheduleState
  currentClass: CurrentClass | null
  nextClass: NextClass | null
  currentClassSlotId: string | null
  countdownText: string
  nextCountdownText: string
  remainingMinutes: number
  progress: number
  dayStatus: DayStatus
  dayStatusLabel: string
  isBreak: boolean
  isWeekend: boolean
  currentTimeLabel: string
  timelineItems: ClassItem[]
}

/**
 * Pure presenter function deriving presentation-ready schedule metrics for Today and Timetable views.
 */
export function deriveTimetableViewModel(
  timetable: ClassItem[],
  now: Date
): TimetableViewModel {
  const dayStatus = getDayStatus(timetable, now)
  const isWeekend = dayStatus === 'weekend'
  const isBreak = dayStatus === 'short-break' || dayStatus === 'lunch-break' || dayStatus === 'free-period'
  const rawSlot = getCurrentClassSlot(timetable, now)
  const remainingMinutes = rawSlot ? getRemainingTime(rawSlot, now) : 0
  const currentSlot = rawSlot && remainingMinutes > 0 ? rawSlot : null
  const nextSlot = getNextClassSlot(timetable, now)
  const currentMin = getMinutesFromMidnight(now)

  const progress = currentSlot ? getCurrentProgress(currentSlot, now) : 0
  const currentTimeLabel = formatMinutesTo12HourTime(currentMin)

  let currentClass: CurrentClass | null = null
  let nextClass: NextClass | null = null
  let currentClassSlotId: string | null = null
  let countdownText = ''
  let nextCountdownText = ''
  let dayStatusLabel = ''

  if (currentSlot) {
    currentClassSlotId = currentSlot.item.id
    currentClass = {
      subject: currentSlot.item.subject,
      room: currentSlot.item.room || 'TBD',
      faculty: currentSlot.item.faculty || 'Faculty',
    }
    countdownText = `Ends in ${remainingMinutes} min`
  }

  if (nextSlot) {
    nextClass = {
      subject: nextSlot.item.subject,
      room: nextSlot.item.room || 'TBD',
      faculty: nextSlot.item.faculty || 'Faculty',
      startTime: nextSlot.item.time.split('-')[0].trim(),
    }
    const minsUntilNext = Math.max(0, nextSlot.startMinutes - currentMin)
    nextCountdownText = `Starts in ${minsUntilNext} min`
  }

  switch (dayStatus) {
    case 'weekend':
      dayStatusLabel = 'No classes today. Enjoy your weekend.'
      break
    case 'before-first':
      dayStatusLabel = nextSlot ? `First class starts in ${nextSlot.startMinutes - currentMin} min` : 'No classes scheduled.'
      break
    case 'in-class':
      dayStatusLabel = `Class in progress (${remainingMinutes} min remaining)`
      break
    case 'short-break':
      dayStatusLabel = nextSlot ? `Break (${nextSlot.startMinutes - currentMin} min remaining)` : 'Break'
      break
    case 'lunch-break':
      dayStatusLabel = nextSlot ? `Lunch Break (${nextSlot.startMinutes - currentMin} min remaining)` : 'Lunch Break'
      break
    case 'free-period':
      dayStatusLabel = nextSlot ? `Free Period (${nextSlot.startMinutes - currentMin} min remaining)` : 'Free Period'
      break
    case 'finished':
      dayStatusLabel = "You're done for today."
      break
  }

  // Structured schedule state model
  let scheduleStateType: 'current' | 'break' | 'finished' | 'empty' = 'empty'
  let scheduleMessage = ''

  if (dayStatus === 'weekend' || (dayStatus === 'before-first' && !currentSlot && !nextSlot)) {
    scheduleStateType = 'empty'
    scheduleMessage = dayStatus === 'weekend' ? 'No classes today' : 'No classes scheduled'
  } else if (currentSlot) {
    scheduleStateType = 'current'
    scheduleMessage = 'Current Class'
  } else if (isBreak || dayStatus === 'before-first') {
    scheduleStateType = 'break'
    if (dayStatus === 'lunch-break') scheduleMessage = 'Lunch Break'
    else if (dayStatus === 'short-break') scheduleMessage = 'Morning Break'
    else if (dayStatus === 'before-first') scheduleMessage = 'Before First Class'
    else scheduleMessage = 'Free Period'
  } else if (dayStatus === 'finished') {
    scheduleStateType = 'finished'
    scheduleMessage = 'Classes finished for today'
  }

  const scheduleState: ScheduleState = {
    type: scheduleStateType,
    slot: currentSlot ? currentSlot.item : undefined,
    nextSlot: nextSlot ? nextSlot.item : undefined,
    message: scheduleMessage,
  }

  // Derive visual timeline item statuses (completed, current, upcoming)
  const parsedSlots = getParsedSlots(timetable)
  const timelineItems: ClassItem[] = parsedSlots.map((slot) => {
    let status: 'completed' | 'current' | 'upcoming'
    if (currentMin >= slot.endMinutes) {
      status = 'completed'
    } else if (currentMin >= slot.startMinutes && currentMin < slot.endMinutes) {
      status = 'current'
    } else {
      status = 'upcoming'
    }

    return {
      ...slot.item,
      status,
    }
  })

  return {
    scheduleState,
    currentClass,
    nextClass,
    currentClassSlotId,
    countdownText,
    nextCountdownText,
    remainingMinutes,
    progress,
    dayStatus,
    dayStatusLabel,
    isBreak,
    isWeekend,
    currentTimeLabel,
    timelineItems,
  }
}
