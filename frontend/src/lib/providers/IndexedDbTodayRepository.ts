import type { TodayRepository } from '../repositories/TodayRepository'
import type { ClassItem, CurrentClass, NextClass } from '../models'
import { getFromStore, getAllFromStore } from '../storage/stores'
import { STORES } from '../storage/schema'
import { bootstrapDatabase } from '../storage/bootstrap'

/**
 * IndexedDB implementation of TodayRepository.
 * Translates between Domain Models and Generic Storage layers.
 */
export class IndexedDbTodayRepository implements TodayRepository {
  private async ensureInitialized(): Promise<void> {
    await bootstrapDatabase()
  }

  async getCurrentClass(): Promise<CurrentClass | null> {
    await this.ensureInitialized()
    try {
      const data = await getFromStore<{ key: string; value: CurrentClass }>(STORES.today, 'currentClass')
      return data ? data.value : null
    } catch (err) {
      throw new Error('TIMETABLE_FETCH_FAILED', { cause: err })
    }
  }

  async getNextClass(): Promise<NextClass | null> {
    await this.ensureInitialized()
    try {
      const data = await getFromStore<{ key: string; value: NextClass }>(STORES.today, 'nextClass')
      return data ? data.value : null
    } catch (err) {
      throw new Error('TIMETABLE_FETCH_FAILED', { cause: err })
    }
  }

  async getTimeline(): Promise<ClassItem[]> {
    await this.ensureInitialized()
    try {
      const items = await getAllFromStore<ClassItem>(STORES.timetable)
      return items
    } catch (err) {
      throw new Error('TIMETABLE_FETCH_FAILED', { cause: err })
    }
  }
}

export default IndexedDbTodayRepository
