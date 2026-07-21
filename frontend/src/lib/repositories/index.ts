import { HttpTodayRepository } from '../providers/HttpTodayRepository'
import { HttpSubjectRepository } from '../providers/HttpSubjectRepository'
import { HttpCampusRepository } from '../providers/HttpCampusRepository'
import { HttpProfileRepository } from '../providers/HttpProfileRepository'
import { HttpAuthRepository } from '../providers/HttpAuthRepository'
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
  return new HttpTodayRepository()
}

/**
 * Factory function creating instances of SubjectRepository.
 * Prepares SubjectsPage dependency injection.
 */
export const createSubjectRepository = (): SubjectRepository => {
  return new HttpSubjectRepository()
}

/**
 * Factory function creating instances of CampusRepository.
 * Prepares CampusPage dependency injection.
 */
export const createCampusRepository = (): CampusRepository => {
  return new HttpCampusRepository()
}

/**
 * Factory function creating instances of ProfileRepository.
 * Prepares ProfilePage dependency injection.
 */
export const createProfileRepository = (): ProfileRepository => {
  return new HttpProfileRepository()
}

/**
 * Factory function creating instances of AuthRepository.
 * Prepares AuthContext dependency injection.
 */
export const createAuthRepository = (): AuthRepository => {
  return new HttpAuthRepository()
}
