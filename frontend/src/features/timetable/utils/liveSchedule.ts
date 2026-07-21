import type { ClassItem } from '../../../lib/models'

export interface ParsedSlot {
  item: ClassItem
  startMinutes: number
  endMinutes: number
}

export type DayStatus =
  | 'weekend'
  | 'before-first'
  | 'in-class'
  | 'short-break'
  | 'lunch-break'
  | 'free-period'
  | 'finished'

/**
 * Parses a 12-hour formatted time string (e.g. "09:00 AM", "01:30 PM") into minutes from midnight.
 */
export function parse12HourTime(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return 0
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3].toUpperCase()
  if (period === 'PM' && hours < 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return hours * 60 + minutes
}

/**
 * Formats minutes from midnight into 12-hour time label (e.g. 570 -> "09:30 AM").
 */
export function formatMinutesTo12HourTime(totalMinutes: number): string {
  const normalized = Math.max(0, Math.min(1439, totalMinutes))
  let hours = Math.floor(normalized / 60)
  const minutes = normalized % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  if (hours > 12) hours -= 12
  if (hours === 0) hours = 12
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  return `${hours < 10 ? '0' : ''}${hours}:${formattedMinutes} ${period}`
}

/**
 * Parses slot time range string (e.g. "09:00 AM - 10:00 AM") into start & end minutes from midnight.
 */
export function parseSlotTimeRange(timeRangeStr: string): { startMinutes: number; endMinutes: number } {
  const parts = timeRangeStr.split('-')
  if (parts.length < 2) {
    const start = parse12HourTime(parts[0])
    return { startMinutes: start, endMinutes: start + 60 }
  }
  return {
    startMinutes: parse12HourTime(parts[0]),
    endMinutes: parse12HourTime(parts[1]),
  }
}

/**
 * Normalizes all timetable slots into sorted parsed slots with minutes from midnight.
 */
export function getParsedSlots(timetable: ClassItem[]): ParsedSlot[] {
  return timetable
    .map((item) => {
      const { startMinutes, endMinutes } = parseSlotTimeRange(item.time)
      return { item, startMinutes, endMinutes }
    })
    .sort((a, b) => a.startMinutes - b.startMinutes)
}

/**
 * Evaluates current system minute from midnight.
 */
export function getMinutesFromMidnight(now: Date): number {
  return now.getHours() * 60 + now.getMinutes()
}

/**
 * Single source of truth function for evaluating day schedule status.
 */
export function getDayStatus(timetable: ClassItem[], now: Date): DayStatus {
  const day = now.getDay()
  if (day === 0 || day === 6) return 'weekend'

  const parsed = getParsedSlots(timetable)
  if (parsed.length === 0) return 'finished'

  const currentMin = getMinutesFromMidnight(now)
  const firstStart = parsed[0].startMinutes
  const lastEnd = parsed[parsed.length - 1].endMinutes

  if (currentMin < firstStart) return 'before-first'
  if (currentMin >= lastEnd) return 'finished'

  // Check if currently inside any class slot
  const activeSlot = parsed.find(
    (slot) => currentMin >= slot.startMinutes && currentMin < slot.endMinutes
  )
  if (activeSlot) return 'in-class'

  // Check gap between slots
  const upcomingSlotIndex = parsed.findIndex((slot) => slot.startMinutes > currentMin)
  if (upcomingSlotIndex > 0) {
    const prevSlot = parsed[upcomingSlotIndex - 1]
    const nextSlot = parsed[upcomingSlotIndex]
    const gapMinutes = nextSlot.startMinutes - prevSlot.endMinutes

    if (gapMinutes <= 15) return 'short-break'
    if (prevSlot.endMinutes >= 720 && prevSlot.endMinutes <= 840) return 'lunch-break'
    return 'free-period'
  }

  return 'free-period'
}

/**
 * Returns currently active class slot, or null if not in class.
 */
export function getCurrentClassSlot(timetable: ClassItem[], now: Date): ParsedSlot | null {
  const currentMin = getMinutesFromMidnight(now)
  const parsed = getParsedSlots(timetable)
  return parsed.find((slot) => currentMin >= slot.startMinutes && currentMin < slot.endMinutes) || null
}

/**
 * Returns next upcoming class slot, or null if all classes finished for today.
 */
export function getNextClassSlot(timetable: ClassItem[], now: Date): ParsedSlot | null {
  const currentMin = getMinutesFromMidnight(now)
  const parsed = getParsedSlots(timetable)
  return parsed.find((slot) => slot.startMinutes > currentMin) || null
}

/**
 * Computes 0-100 percentage of time elapsed in current class slot.
 */
export function getCurrentProgress(slot: ParsedSlot | null, now: Date): number {
  if (!slot) return 0
  const currentMin = getMinutesFromMidnight(now)
  const total = slot.endMinutes - slot.startMinutes
  if (total <= 0) return 0
  const elapsed = currentMin - slot.startMinutes
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
}

/**
 * Computes remaining minutes in current class slot.
 */
export function getRemainingTime(slot: ParsedSlot | null, now: Date): number {
  if (!slot) return 0
  const currentMin = getMinutesFromMidnight(now)
  return Math.max(0, slot.endMinutes - currentMin)
}
