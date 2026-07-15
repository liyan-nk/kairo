import { getFromStore, putToStore, getAllFromStore } from './stores'
import { STORES } from './schema'
import {
  getMockCurrentClass,
  getMockNextClass,
  getMockTimeline,
  getMockAttendanceSummary,
} from '../../features/today/data/mockToday'

let bootstrapPromise: Promise<void> | null = null

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
      ])
    } catch (err) {
      // Allow retry on subsequent calls if seeding fails
      bootstrapPromise = null
      throw new Error('DATABASE_BOOTSTRAP_FAILED', { cause: err })
    }
  })()

  return bootstrapPromise
}
