import { getFromStore, putToStore, getAllFromStore } from './stores'
import { STORES } from './schema'
import {
  getMockCurrentClass,
  getMockNextClass,
  getMockTimeline,
  getMockAttendanceSummary,
} from '../../features/today/data/mockToday'
import type { AttendanceRecord } from '../models'

let bootstrapPromise: Promise<void> | null = null

/**
 * Generates mock attendance history records for a subject.
 * Guarantees a deterministic sequence of weekdays going backward.
 */
function generateMockAttendanceRecords(
  subjectId: string,
  total: number,
  presentCount: number
): Omit<AttendanceRecord, 'id'>[] {
  const records = []
  const currentDate = new Date('2026-07-15')
  let generated = 0
  let presentsLeft = presentCount

  while (generated < total) {
    const day = currentDate.getDay()
    if (day !== 0 && day !== 6) { // Weekdays only
      const status = presentsLeft > 0 ? 'Present' : 'Absent'
      if (status === 'Present') presentsLeft--

      const timetableSlots = ['09:00 AM', '10:00 AM', '11:15 AM', '12:15 PM']
      const timetableSlot = timetableSlots[generated % timetableSlots.length]

      records.push({
        subjectId,
        date: currentDate.toISOString().split('T')[0],
        status: status as 'Present' | 'Absent',
        timetableSlot,
        notes: status === 'Absent' ? 'Medical leave' : undefined,
      })
      generated++
    }
    currentDate.setDate(currentDate.getDate() - 1)
  }
  return records
}

/**
 * Self-contained seeder for the today store.
 * Seeds current class, next class, and attendance summary if empty.
 */
async function ensureTodaySeeded(): Promise<void> {
  const currentClass = await getFromStore(STORES.today, 'currentClass')
  if (!currentClass) {
    await putToStore(STORES.today, { key: 'currentClass', value: getMockCurrentClass() })
    await putToStore(STORES.today, { key: 'nextClass', value: getMockNextClass() })
    await putToStore(STORES.today, { key: 'attendanceSummary', value: getMockAttendanceSummary() })
  }
}

/**
 * Self-contained seeder for the timetable store.
 * Seeds timeline list items if empty.
 */
async function ensureTimetableSeeded(): Promise<void> {
  const timeline = await getAllFromStore(STORES.timetable)
  if (timeline.length === 0) {
    const mockTimeline = getMockTimeline()
    for (const item of mockTimeline) {
      await putToStore(STORES.timetable, item)
    }
  }
}

/**
 * Self-contained seeder for the subjects store.
 * Seeds course details list items if empty.
 */
async function ensureSubjectsSeeded(): Promise<void> {
  const subjects = await getAllFromStore(STORES.subjects)
  if (subjects.length === 0) {
    const mockSubjects = [
      {
        id: '1',
        code: 'CS101',
        name: 'Java Programming',
        faculty: 'Dr. Sarah Jenkins',
        room: 'Room 404',
        attendedClasses: 23,
        totalClasses: 25,
      },
      {
        id: '2',
        code: 'CS102',
        name: 'Database Management Systems',
        faculty: 'Prof. Alok Verma',
        room: 'Room 102',
        attendedClasses: 17,
        totalClasses: 22,
      },
      {
        id: '3',
        code: 'CS103',
        name: 'Operating Systems',
        faculty: 'Prof. Alok Verma',
        room: 'Room 102',
        attendedClasses: 17,
        totalClasses: 23,
      },
      {
        id: '4',
        code: 'CS104',
        name: 'Computer Networks',
        faculty: 'Dr. Sarah Jenkins',
        room: 'Room 404',
        attendedClasses: 12,
        totalClasses: 20,
      },
    ]
    for (const subject of mockSubjects) {
      await putToStore(STORES.subjects, subject)
    }
  }
}

/**
 * Self-contained seeder for the attendanceHistory store.
 * Seeds chronological records matching canonical Subject counts if empty.
 */
async function ensureAttendanceHistorySeeded(): Promise<void> {
  const history = await getAllFromStore<AttendanceRecord>(STORES.attendanceHistory)
  if (history.length === 0) {
    const specs = [
      { subjectId: '1', total: 25, present: 23 },
      { subjectId: '2', total: 22, present: 17 },
      { subjectId: '3', total: 23, present: 17 },
      { subjectId: '4', total: 20, present: 12 },
    ]
    for (const spec of specs) {
      const records = generateMockAttendanceRecords(spec.subjectId, spec.total, spec.present)
      for (let i = 0; i < records.length; i++) {
        await putToStore(STORES.attendanceHistory, {
          id: `${spec.subjectId}_rec_${i}`,
          ...records[i],
        })
      }
    }
  }
}

/**
 * Lazily seeds mock data into the browser's IndexedDB stores on first application launch.
 * Uses a single cached promise to prevent race conditions during concurrent calls.
 */
export function bootstrapDatabase(): Promise<void> {
  if (bootstrapPromise) {
    return bootstrapPromise
  }

  bootstrapPromise = (async () => {
    try {
      // Orchestrate independent store-level seeders concurrently
      await Promise.all([
        ensureTodaySeeded(),
        ensureTimetableSeeded(),
        ensureSubjectsSeeded(),
        ensureAttendanceHistorySeeded(),
      ])
    } catch (err) {
      // Allow retry on subsequent calls if seeding fails
      bootstrapPromise = null
      throw new Error('DATABASE_BOOTSTRAP_FAILED', { cause: err })
    }
  })()

  return bootstrapPromise
}
