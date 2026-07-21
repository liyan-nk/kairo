import type { ProfileRepository } from '../repositories/ProfileRepository'
import type { UserProfile } from '../models'
import { IndexedDbProfileRepository } from './IndexedDbProfileRepository'
import { apiClient } from './apiClient'

export class HttpProfileRepository implements ProfileRepository {
  private local = new IndexedDbProfileRepository()

  async getProfile(): Promise<UserProfile | null> {
    try {
      const data = await apiClient.get<any>('/users/me')
      const profile: UserProfile = {
        id: data.id,
        name: data.name,
        rollNumber: data.rollNumber || '',
        department: data.department || '',
        semester: data.semester || '',
        section: data.section || '',
        officialBaselinePercentage: data.lastOfficialBaseline || undefined,
        lastSyncDate: data.lastOfficialUpdateDate || undefined
      }
      await this.local.updateProfile(profile)
      return profile
    } catch (err) {
      console.warn('Failed to fetch profile online, returning cached version', err)
      return this.local.getProfile()
    }
  }

  async updateProfile(profile: UserProfile): Promise<void> {
    const requestPayload = {
      name: profile.name,
      rollNumber: profile.rollNumber,
      department: profile.department,
      semester: profile.semester,
      section: profile.section
    }

    try {
      const data = await apiClient.put<any>('/users/me', requestPayload)
      const updatedProfile: UserProfile = {
        ...profile,
        id: data.id,
        name: data.name,
        rollNumber: data.rollNumber || '',
        department: data.department || '',
        semester: data.semester || '',
        section: data.section || '',
      }
      await this.local.updateProfile(updatedProfile)
    } catch (err) {
      // Offline fallback: save locally
      await this.local.updateProfile(profile)
      throw err
    }
  }

  async syncOfficialBaseline(officialPercentage: number): Promise<void> {
    await this.local.syncOfficialBaseline(officialPercentage)
  }
}

export default HttpProfileRepository
