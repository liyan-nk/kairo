import type { ProfileRepository } from '../repositories/ProfileRepository'
import type { UserProfile } from '../models'
import { getFromStore, putToStore } from '../storage/stores'
import { STORES } from '../storage/schema'

export class IndexedDbProfileRepository implements ProfileRepository {
  async getProfile(): Promise<UserProfile | null> {
    const profile = await getFromStore<UserProfile>(STORES.profile, 'profile_student')
    return profile || null
  }

  async updateProfile(profile: UserProfile): Promise<void> {
    await putToStore(STORES.profile, profile)
  }

  async syncOfficialBaseline(officialPercentage: number): Promise<void> {
    const profile = await this.getProfile()
    if (!profile) return

    const updated: UserProfile = {
      ...profile,
      lastSyncDate: new Date().toISOString().split('T')[0],
      officialBaselinePercentage: Math.round(officialPercentage),
    }
    await putToStore(STORES.profile, updated)
  }
}
