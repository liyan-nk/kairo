import { getFromStore, putToStore, getAllFromStore } from './stores'
import { STORES } from './schema'
import {
  getMockCurrentClass,
  getMockNextClass,
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
 * Seeds current class and next class if empty.
 */
async function ensureTodaySeeded(): Promise<void> {
  const currentClass = await getFromStore(STORES.today, 'currentClass')
  if (!currentClass) {
    await putToStore(STORES.today, { key: 'currentClass', value: getMockCurrentClass() })
    await putToStore(STORES.today, { key: 'nextClass', value: getMockNextClass() })
  }
}

/**
 * Self-contained seeder for the timetable store.
 * Seeds timeline list items if empty.
 */
async function ensureTimetableSeeded(): Promise<void> {
  const timeline = await getAllFromStore(STORES.timetable)
  if (timeline.length === 0) {
    const subjectsList = [
      { name: 'Java Programming', room: 'Room 404', faculty: 'Dr. Sarah Jenkins' },
      { name: 'Database Management Systems', room: 'Room 102', faculty: 'Prof. Alok Verma' },
      { name: 'Morning Break', room: '', faculty: '' },
      { name: 'Operating Systems', room: 'Room 102', faculty: 'Prof. Alok Verma' },
      { name: 'Computer Networks', room: 'Room 404', faculty: 'Dr. Sarah Jenkins' },
    ]

    const timeSlots = [
      '09:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 11:15 AM',
      '11:15 AM - 12:15 PM',
      '12:15 PM - 01:15 PM',
    ]

    const weekdays: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

    for (let dayIdx = 0; dayIdx < weekdays.length; dayIdx++) {
      const day = weekdays[dayIdx]
      for (let slotIdx = 0; slotIdx < 5; slotIdx++) {
        // Shift subjects list slightly per day to create distinct weekday schedules
        const shiftedIdx = (slotIdx + dayIdx) % 5
        const isBreak = shiftedIdx === 2
        const sub = subjectsList[shiftedIdx]

        const item = {
          id: `${day.toLowerCase()}_slot_${slotIdx + 1}`,
          subject: sub.name,
          time: timeSlots[slotIdx],
          status: 'upcoming' as const,
          room: isBreak ? undefined : sub.room,
          faculty: isBreak ? undefined : sub.faculty,
          day,
        }
        await putToStore(STORES.timetable, item)
      }
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
 * Self-contained seeder for proxyReports and lostFound stores.
 */
async function ensureCampusSeeded(): Promise<void> {
  const reports = await getAllFromStore(STORES.proxyReports)
  const todayStr = new Date().toISOString().split('T')[0]
  if (reports.length === 0) {
    const mockReports = [
      {
        id: 'report_1',
        subjectId: '3',
        timetableSlotId: '1',
        expectedSubject: 'Operating Systems',
        actualSubject: 'Database Management Systems',
        room: 'Room 102',
        faculty: 'Prof. Alok Verma',
        reportCount: 3,
        status: 'Likely' as const,
        date: todayStr,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'report_2',
        subjectId: '4',
        timetableSlotId: '2',
        expectedSubject: 'Computer Networks',
        actualSubject: 'Java Programming',
        room: 'Room 404',
        faculty: 'Dr. Sarah Jenkins',
        reportCount: 7,
        status: 'Verified' as const,
        date: todayStr,
        createdAt: new Date().toISOString(),
      },
    ]
    for (const report of mockReports) {
      await putToStore(STORES.proxyReports, report)
    }
  }

  const lfItems = await getAllFromStore(STORES.lostFound)
  if (lfItems.length === 0) {
    const mockLfItems = [
      {
        id: 'lf_1',
        title: 'Scientific Calculator',
        description: 'Found in Lab 2. FX-991EX model.',
        category: 'Electronics',
        location: 'Lab 2',
        date: todayStr,
        status: 'Found' as const,
        question: 'What name is written on the back of the cover?',
        contactInfo: 'Prof. Alok Verma',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'lf_2',
        title: 'Blue Water Bottle',
        description: 'Left near the canteen.',
        category: 'Personal Items',
        location: 'Canteen',
        date: todayStr,
        status: 'Lost' as const,
        question: 'What brand or sticker is on the bottle?',
        contactInfo: 'Roll CS-203',
        createdAt: new Date().toISOString(),
      },
    ]
    for (const item of mockLfItems) {
      await putToStore(STORES.lostFound, item)
    }
  }
}

/**
 * Self-contained seeder for the student profile store.
 */
async function ensureProfileSeeded(): Promise<void> {
  const profile = await getFromStore(STORES.profile, 'profile_student')
  if (!profile) {
    const mockProfile = {
      id: 'profile_student',
      name: 'Liyan',
      rollNumber: 'CS-2026-104',
      department: 'Computer Science & Engineering',
      semester: '5th Semester',
      section: 'Section A',
      lastSyncDate: new Date('2026-07-15').toISOString().split('T')[0],
      officialBaselinePercentage: 80,
    }
    await putToStore(STORES.profile, mockProfile)
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
        ensureCampusSeeded(),
        ensureProfileSeeded(),
      ])
    } catch (err) {
      // Allow retry on subsequent calls if seeding fails
      bootstrapPromise = null
      throw new Error('DATABASE_BOOTSTRAP_FAILED', { cause: err })
    }
  })()

  return bootstrapPromise
}
