import type { TodayRepository } from '../repositories/TodayRepository'
import type { ClassItem, AttendanceSummary, CurrentClass, NextClass } from '../models'
import {
  getMockCurrentClass,
  getMockNextClass,
  getMockTimeline,
  getMockAttendanceSummary,
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
      throw new Error('TIMETABLE_FETCH_FAILED')
    }
  }

  async getNextClass(): Promise<NextClass | null> {
    try {
      const data = getMockNextClass()
      return data
    } catch (err) {
      throw new Error('TIMETABLE_FETCH_FAILED')
    }
  }

  async getTimeline(): Promise<ClassItem[]> {
    try {
      const data = getMockTimeline()
      return data
    } catch (err) {
      throw new Error('TIMETABLE_FETCH_FAILED')
    }
  }

  async getAttendanceSummary(): Promise<AttendanceSummary> {
    try {
      const data = getMockAttendanceSummary()
      return data
    } catch (err) {
      throw new Error('ATTENDANCE_FETCH_FAILED')
    }
  }
}

export default MockTodayRepository
