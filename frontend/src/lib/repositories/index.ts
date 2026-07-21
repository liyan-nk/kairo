import { IndexedDbTodayRepository } from '../providers/IndexedDbTodayRepository'
import { IndexedDbSubjectRepository } from '../providers/IndexedDbSubjectRepository'
import { IndexedDbCampusRepository } from '../providers/IndexedDbCampusRepository'
import { IndexedDbProfileRepository } from '../providers/IndexedDbProfileRepository'
import { MockAuthRepository } from '../providers/MockAuthRepository'
import type { TodayRepository } from './TodayRepository'
import type { SubjectRepository } from './SubjectRepository'
import type { CampusRepository } from './CampusRepository'
import type { ProfileRepository } from './ProfileRepository'
import type { AuthRepository } from './AuthRepository'

export * from './TodayRepository'
export * from './SubjectRepository'
export * from './CampusRepository'
export * from './ProfileRepository'
export * from './AuthRepository'
export * from './SessionPersistence'

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

/**
 * Factory function creating instances of CampusRepository.
 * Prepares CampusPage dependency injection.
 */
export const createCampusRepository = (): CampusRepository => {
  return new IndexedDbCampusRepository()
}

/**
 * Factory function creating instances of ProfileRepository.
 * Prepares ProfilePage dependency injection.
 */
export const createProfileRepository = (): ProfileRepository => {
  return new IndexedDbProfileRepository()
}

/**
 * Factory function creating instances of AuthRepository.
 * Prepares AuthContext dependency injection.
 */
export const createAuthRepository = (): AuthRepository => {
  return new MockAuthRepository()
}
