import type { Subject, AttendanceRecord } from '../models'

export interface SubjectRepository {
  getSubjects(): Promise<Subject[]>
  getSubject(id: string): Promise<Subject | null>
  saveSubject(subject: Subject): Promise<void>
  updateAttendance(id: string, attendedClasses: number, totalClasses: number): Promise<void>
  getAttendanceHistory(subjectId: string): Promise<AttendanceRecord[]>
  addAttendanceRecord(record: AttendanceRecord): Promise<void>
  updateAttendanceRecord(record: AttendanceRecord): Promise<void>
  markAttendance(
    subjectId: string,
    timetableSlotId: string,
    status: 'Present' | 'Absent',
    date?: string
  ): Promise<void>
  undoAttendance(
    attendanceRecordId: string
  ): Promise<void>
}
