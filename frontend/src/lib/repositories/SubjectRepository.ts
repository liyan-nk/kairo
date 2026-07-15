import type { Subject } from '../models'

export interface SubjectRepository {
  getSubjects(): Promise<Subject[]>
  getSubject(id: string): Promise<Subject | null>
  saveSubject(subject: Subject): Promise<void>
  updateAttendance(id: string, attendedClasses: number, totalClasses: number): Promise<void>
}
