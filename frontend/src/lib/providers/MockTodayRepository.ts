import type { TodayRepository } from '../repositories/TodayRepository'
import type { ClassItem, CurrentClass, NextClass } from '../models'
import {
  getMockCurrentClass,
  getMockNextClass,
  getMockTimeline,
} from '../../features/today/data/mockToday'

/**
 * Mock provider implementation of TodayRepository.
 * Queries mock data functions asynchronously to prepare the architecture for database inputs.
 */
export class MockTodayRepository implements TodayRepository {
  async getCurrentClass(): Promise<CurrentClass | null> {
    try {
      const data = getMockCurrentClass()
      return data
    } catch (err) {
      throw new Error('TIMETABLE_FETCH_FAILED', { cause: err })
    }
  }

  async getNextClass(): Promise<NextClass | null> {
    try {
      const data = getMockNextClass()
      return data
    } catch (err) {
      throw new Error('TIMETABLE_FETCH_FAILED', { cause: err })
    }
  }

  async getTimeline(): Promise<ClassItem[]> {
    try {
      const data = getMockTimeline()
      return data
    } catch (err) {
      throw new Error('TIMETABLE_FETCH_FAILED', { cause: err })
    }
  }
}

export default MockTodayRepository
