import { getFromStore, putToStore } from './stores'
import { STORES } from './schema'
import {
  getMockCurrentClass,
  getMockNextClass,
  getMockTimeline,
  getMockAttendanceSummary,
} from '../../features/today/data/mockToday'

let bootstrapPromise: Promise<void> | null = null

/**
 * Lazily seeds mock data into the browser's IndexedDB stores on first application launch.
 * Uses a single cached promise cache to ensure idempotence across concurrent calls.
 */
export function bootstrapDatabase(): Promise<void> {
  if (bootstrapPromise) {
    return bootstrapPromise
  }

  bootstrapPromise = (async () => {
    try {
      const isBootstrapped = await getFromStore<{ key: string; value: boolean }>(STORES.settings, 'isBootstrapped')
      if (isBootstrapped && isBootstrapped.value) {
        return
      }

      // Seed Today stores
      await putToStore(STORES.today, { key: 'currentClass', value: getMockCurrentClass() })
      await putToStore(STORES.today, { key: 'nextClass', value: getMockNextClass() })
      await putToStore(STORES.today, { key: 'attendanceSummary', value: getMockAttendanceSummary() })

      // Seed Timetable Store
      const timeline = getMockTimeline()
      for (const item of timeline) {
        await putToStore(STORES.timetable, item)
      }

      // Seed Subjects Store (canonical data only - no derived properties stored)
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

      // Mark bootstrap completed
      await putToStore(STORES.settings, { key: 'isBootstrapped', value: true })
    } catch (err) {
      // Allow retry on subsequent calls if seeding fails
      bootstrapPromise = null
      throw new Error('DATABASE_BOOTSTRAP_FAILED', { cause: err })
    }
  })()

  return bootstrapPromise
}
