import type { TodayRepository } from '../repositories/TodayRepository'
import type { ClassItem, CurrentClass, NextClass } from '../models'
import { apiClient } from './apiClient'

export class HttpTodayRepository implements TodayRepository {
  private todayPromise: Promise<any> | null = null
  private lastFetchTime = 0
  private cacheTtlMs = 800 // De-duplication window for concurrent requests

  private getTodayData(): Promise<any> {
    const now = Date.now()
    if (this.todayPromise && (now - this.lastFetchTime < this.cacheTtlMs)) {
      return this.todayPromise
    }

    this.lastFetchTime = now
    this.todayPromise = apiClient.get<any>('/today').catch((err) => {
      this.todayPromise = null
      throw err
    })

    return this.todayPromise
  }

  async getCurrentClass(): Promise<CurrentClass | null> {
    try {
      const data = await this.getTodayData()
      if (!data.currentClass) return null

      return {
        subject: data.currentClass.subjectName,
        room: data.currentClass.room || '',
        faculty: data.currentClass.faculty || '',
      }
    } catch (err) {
      console.warn('Failed to fetch current class online', err)
      return null
    }
  }

  async getNextClass(): Promise<NextClass | null> {
    try {
      const data = await this.getTodayData()
      if (!data.nextClass) return null

      return {
        subject: data.nextClass.subjectName,
        room: data.nextClass.room || '',
        faculty: data.nextClass.faculty || '',
        startTime: this.formatTime12h(data.nextClass.startTime),
      }
    } catch (err) {
      console.warn('Failed to fetch next class online', err)
      return null
    }
  }

  async getTimeline(): Promise<ClassItem[]> {
    try {
      const data = await this.getTodayData()
      const timetable = data.todayTimetable || []
      const current = data.currentClass
      const completed = data.completedClasses || []

      return timetable.map((slot: any) => {
        let status: 'completed' | 'current' | 'upcoming' = 'upcoming'
        if (current && slot.id === current.id) {
          status = 'current'
        } else if (completed.some((c: any) => c.id === slot.id)) {
          status = 'completed'
        }

        return {
          id: slot.id,
          subject: slot.subjectName,
          time: `${this.formatTime12h(slot.startTime)} - ${this.formatTime12h(slot.endTime)}`,
          status,
          room: slot.room || undefined,
          faculty: slot.faculty || undefined,
          day: this.capitalizeDay(slot.dayOfWeek) as any,
        }
      })
    } catch (err) {
      console.warn('Failed to fetch timeline online', err)
      return []
    }
  }

  private formatTime12h(timeStr: string): string {
    if (!timeStr) return ''
    const parts = timeStr.split(':')
    if (parts.length < 2) return timeStr
    let hours = parseInt(parts[0], 10)
    const minutes = parts[1]
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const strHours = hours < 10 ? `0${hours}` : `${hours}`
    return `${strHours}:${minutes} ${ampm}`
  }

  private capitalizeDay(dayStr: string): string {
    if (!dayStr) return ''
    const day = dayStr.toLowerCase()
    return day.charAt(0).toUpperCase() + day.slice(1)
  }
}

export default HttpTodayRepository
