import type { SubjectRepository } from '../repositories/SubjectRepository'
import type { Subject, AttendanceRecord } from '../models'
import { IndexedDbSubjectRepository } from './IndexedDbSubjectRepository'
import { apiClient } from './apiClient'

export class HttpSubjectRepository implements SubjectRepository {
  private local = new IndexedDbSubjectRepository()

  async getSubjects(): Promise<Subject[]> {
    try {
      const data = await apiClient.get<any[]>('/courses')
      const subjects = data.map((c) => this.mapToSubject(c))
      
      // Sync to local cache
      for (const subject of subjects) {
        await this.local.saveSubject(subject)
      }
      
      return subjects
    } catch (err) {
      console.warn('Failed to fetch subjects online, returning cached version', err)
      return this.local.getSubjects()
    }
  }

  async getSubject(id: string): Promise<Subject | null> {
    try {
      const data = await apiClient.get<any>(`/courses/${id}`)
      const subject = this.mapToSubject(data.course)
      
      // Sync to local cache
      await this.local.saveSubject(subject)
      return subject
    } catch (err) {
      console.warn('Failed to fetch subject online, returning cached version', err)
      return this.local.getSubject(id)
    }
  }

  async saveSubject(subject: Subject): Promise<void> {
    await this.local.saveSubject(subject)
  }

  async updateAttendance(id: string, attendedClasses: number, totalClasses: number): Promise<void> {
    await this.local.updateAttendance(id, attendedClasses, totalClasses)
  }

  async getAttendanceHistory(subjectId: string): Promise<AttendanceRecord[]> {
    try {
      const data = await apiClient.get<any[]>(`/courses/${subjectId}/attendance-logs`)
      const records = data.map((log) => this.mapToAttendanceRecord(log))

      // Clean local cache of old records for this subject to prevent stale state, then cache new ones
      const localRecords = await this.local.getAttendanceHistory(subjectId)
      for (const r of localRecords) {
        await this.local.undoAttendance(r.id)
      }
      for (const r of records) {
        await this.local.addAttendanceRecord(r)
      }

      return records
    } catch (err) {
      console.warn('Failed to fetch attendance history online, returning cached version', err)
      return this.local.getAttendanceHistory(subjectId)
    }
  }

  async addAttendanceRecord(record: AttendanceRecord): Promise<void> {
    await this.local.addAttendanceRecord(record)
  }

  async updateAttendanceRecord(record: AttendanceRecord): Promise<void> {
    try {
      const data = await apiClient.put<any>(`/attendance-logs/${record.id}`, {
        status: record.status.toUpperCase(),
        notes: record.notes || '',
      })
      const updated = this.mapToAttendanceRecord(data)
      await this.local.updateAttendanceRecord(updated)
    } catch (err) {
      await this.local.updateAttendanceRecord(record)
      throw err
    }
  }

  async markAttendance(
    subjectId: string,
    timetableSlotId: string,
    status: 'Present' | 'Absent',
    dateStr?: string
  ): Promise<void> {
    const targetDate = dateStr || new Date().toISOString().split('T')[0]
    
    try {
      const data = await apiClient.post<any>('/attendance-logs', {
        courseId: subjectId,
        slotId: timetableSlotId,
        date: targetDate,
        status: status.toUpperCase(),
        notes: '',
      })
      const record = this.mapToAttendanceRecord(data)
      await this.local.addAttendanceRecord(record)
    } catch (err) {
      // Fallback: apply to local cache
      await this.local.markAttendance(subjectId, timetableSlotId, status, targetDate)
      throw err
    }
  }

  async undoAttendance(attendanceRecordId: string): Promise<void> {
    try {
      await apiClient.delete(`/attendance-logs/${attendanceRecordId}`)
      await this.local.undoAttendance(attendanceRecordId)
    } catch (err) {
      await this.local.undoAttendance(attendanceRecordId)
      throw err
    }
  }

  private mapToSubject(c: any): Subject {
    return {
      id: c.id,
      code: c.code,
      name: c.name,
      faculty: c.faculty || '',
      room: c.room || '',
      attendedClasses: c.attendedClasses || 0,
      totalClasses: c.totalClasses || 0,
    }
  }

  private mapToAttendanceRecord(log: any): AttendanceRecord {
    return {
      id: log.id,
      subjectId: log.courseId,
      date: log.date,
      status: log.status === 'PRESENT' ? 'Present' : 'Absent',
      timetableSlot: log.slotId,
      notes: log.notes || undefined,
    }
  }
}

export default HttpSubjectRepository
