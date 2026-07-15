import { IndexedDbTodayRepository } from '../providers/IndexedDbTodayRepository'
import type { TodayRepository } from './TodayRepository'

export * from './TodayRepository'
export * from './SubjectRepository'
export * from './CampusRepository'
export * from './ProfileRepository'

/**
 * Factory function creating instances of TodayRepository.
 * Prepares TodayPage dependency injection.
 */
export const createTodayRepository = (): TodayRepository => {
  return new IndexedDbTodayRepository()
}
