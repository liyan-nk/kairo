import type { ClassItem, CurrentClass, NextClass } from '../models'

/**
 * Repository interface defining async operations to fetch student timetable data for the Today Experience.
 */
export interface TodayRepository {
  getCurrentClass(): Promise<CurrentClass | null>
  getNextClass(): Promise<NextClass | null>
  getTimeline(): Promise<ClassItem[]>
}
