import { IndexedDbTodayRepository } from '../providers/IndexedDbTodayRepository'
import { IndexedDbSubjectRepository } from '../providers/IndexedDbSubjectRepository'
import type { TodayRepository } from './TodayRepository'
import type { SubjectRepository } from './SubjectRepository'

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

/**
 * Factory function creating instances of SubjectRepository.
 * Prepares SubjectsPage dependency injection.
 */
export const createSubjectRepository = (): SubjectRepository => {
  return new IndexedDbSubjectRepository()
}
