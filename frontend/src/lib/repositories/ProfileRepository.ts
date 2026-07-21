import type { UserProfile } from '../models'

export interface ProfileRepository {
  getProfile(): Promise<UserProfile | null>
  updateProfile(profile: UserProfile): Promise<void>
  syncOfficialBaseline(officialPercentage: number): Promise<void>
}
