import type { SubjectRepository } from '../repositories/SubjectRepository'
import type { Subject, AttendanceRecord } from '../models'
import { getFromStore, getAllFromStore, putToStore, deleteFromStore } from '../storage/stores'
import { STORES } from '../storage/schema'
import { bootstrapDatabase } from '../storage/bootstrap'

/**
 * IndexedDB implementation of SubjectRepository.
 * Handles storage CRUD for academic subjects using the generic stores utility.
 */
export class IndexedDbSubjectRepository implements SubjectRepository {
  private async ensureInitialized(): Promise<void> {
    await bootstrapDatabase()
  }

  async getSubjects(): Promise<Subject[]> {
    await this.ensureInitialized()
    try {
      const items = await getAllFromStore<Subject>(STORES.subjects)
      return items
    } catch (err) {
      throw new Error('SUBJECTS_FETCH_FAILED', { cause: err })
    }
  }

  async getSubject(id: string): Promise<Subject | null> {
    await this.ensureInitialized()
    try {
      const item = await getFromStore<Subject>(STORES.subjects, id)
      return item
    } catch (err) {
      throw new Error('SUBJECT_FETCH_FAILED', { cause: err })
    }
  }

  async saveSubject(subject: Subject): Promise<void> {
    await this.ensureInitialized()
    try {
      await putToStore(STORES.subjects, subject)
    } catch (err) {
      throw new Error('SUBJECT_SAVE_FAILED', { cause: err })
    }
  }

  async updateAttendance(id: string, attendedClasses: number, totalClasses: number): Promise<void> {
    await this.ensureInitialized()
    try {
      const subject = await getFromStore<Subject>(STORES.subjects, id)
      if (!subject) {
        throw new Error('SUBJECT_NOT_FOUND')
      }
      const updated = {
        ...subject,
        attendedClasses,
        totalClasses,
      }
      await putToStore(STORES.subjects, updated)
    } catch (err) {
      throw new Error('ATTENDANCE_UPDATE_FAILED', { cause: err })
    }
  }

  async getAttendanceHistory(subjectId: string): Promise<AttendanceRecord[]> {
    await this.ensureInitialized()
    try {
      const all = await getAllFromStore<AttendanceRecord>(STORES.attendanceHistory)
      return all.filter((r) => r.subjectId === subjectId)
    } catch (err) {
      throw new Error('HISTORY_FETCH_FAILED', { cause: err })
    }
  }

  async addAttendanceRecord(record: AttendanceRecord): Promise<void> {
    await this.ensureInitialized()
    try {
      // 1. Add history log record
      await putToStore(STORES.attendanceHistory, record)
      
      // 2. Fetch subject and atomically update its canonical counters
      const subject = await getFromStore<Subject>(STORES.subjects, record.subjectId)
      if (subject) {
        const isPresent = record.status === 'Present'
        const updated = {
          ...subject,
          attendedClasses: subject.attendedClasses + (isPresent ? 1 : 0),
          totalClasses: subject.totalClasses + 1,
        }
        await putToStore(STORES.subjects, updated)
      }
    } catch (err) {
      throw new Error('ADD_HISTORY_RECORD_FAILED', { cause: err })
    }
  }

  async updateAttendanceRecord(record: AttendanceRecord): Promise<void> {
    await this.ensureInitialized()
    try {
      // 1. Fetch old record to calculate counter difference
      const oldRecord = await getFromStore<AttendanceRecord>(STORES.attendanceHistory, record.id)
      if (!oldRecord) {
        throw new Error('OLD_RECORD_NOT_FOUND')
      }

      // 2. Update history log record
      await putToStore(STORES.attendanceHistory, record)

      // 3. Update aggregate Subject counters atomically if status changed
      if (oldRecord.status !== record.status) {
        const subject = await getFromStore<Subject>(STORES.subjects, record.subjectId)
        if (subject) {
          const wasPresent = oldRecord.status === 'Present'
          const isPresent = record.status === 'Present'
          
          let diffAttended = 0
          if (wasPresent && !isPresent) {
            diffAttended = -1
          } else if (!wasPresent && isPresent) {
            diffAttended = 1
          }

          const updated = {
            ...subject,
            attendedClasses: subject.attendedClasses + diffAttended,
            // totalClasses does not change because it's an edit
          }
          await putToStore(STORES.subjects, updated)
        }
      }
    } catch (err) {
      throw new Error('UPDATE_HISTORY_RECORD_FAILED', { cause: err })
    }
  }

  async markAttendance(
    subjectId: string,
    timetableSlotId: string,
    status: 'Present' | 'Absent',
    dateStr?: string
  ): Promise<void> {
    await this.ensureInitialized()
    const targetDate = dateStr || new Date().toISOString().split('T')[0]
    try {
      // 1. Duplicate protection check
      const history = await getAllFromStore<AttendanceRecord>(STORES.attendanceHistory)
      const duplicate = history.find(
        (r) => r.subjectId === subjectId && r.timetableSlot === timetableSlotId && r.date === targetDate
      )
      if (duplicate) {
        // Record already exists for this subject, slot, and date. Reject duplicate write.
        return
      }

      // 2. Fetch canonical Subject
      const subject = await getFromStore<Subject>(STORES.subjects, subjectId)
      if (!subject) {
        throw new Error('SUBJECT_NOT_FOUND')
      }

      // 3. Create AttendanceHistory record
      const recordId = `${subjectId}_${timetableSlotId}_${targetDate}`
      const newRecord: AttendanceRecord = {
        id: recordId,
        subjectId,
        date: targetDate,
        status,
        timetableSlot: timetableSlotId,
      }

      // 4. Calculate updated Subject aggregate counters
      const isPresent = status === 'Present'
      const updatedSubject: Subject = {
        ...subject,
        totalClasses: subject.totalClasses + 1,
        attendedClasses: subject.attendedClasses + (isPresent ? 1 : 0),
      }

      // 5. Persist both atomically
      await putToStore(STORES.attendanceHistory, newRecord)
      await putToStore(STORES.subjects, updatedSubject)
    } catch (err) {
      throw new Error('MARK_ATTENDANCE_FAILED', { cause: err })
    }
  }

  async undoAttendance(attendanceRecordId: string): Promise<void> {
    await this.ensureInitialized()
    try {
      // 1. Fetch record from attendanceHistory
      const record = await getFromStore<AttendanceRecord>(STORES.attendanceHistory, attendanceRecordId)
      if (!record) {
        return
      }

      // 2. Fetch canonical Subject
      const subject = await getFromStore<Subject>(STORES.subjects, record.subjectId)
      if (subject) {
        const isPresent = record.status === 'Present'
        const updatedSubject: Subject = {
          ...subject,
          totalClasses: Math.max(0, subject.totalClasses - 1),
          attendedClasses: Math.max(0, subject.attendedClasses - (isPresent ? 1 : 0)),
        }
        await putToStore(STORES.subjects, updatedSubject)
      }

      // 3. Delete AttendanceHistory record
      await deleteFromStore(STORES.attendanceHistory, attendanceRecordId)
    } catch (err) {
      throw new Error('UNDO_ATTENDANCE_FAILED', { cause: err })
    }
  }
}

export default IndexedDbSubjectRepository
