import type { SubjectRepository } from '../repositories/SubjectRepository'
import type { Subject } from '../models'
import { getFromStore, getAllFromStore, putToStore } from '../storage/stores'
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
}

export default IndexedDbSubjectRepository
