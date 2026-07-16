export interface ClassItem {
  id: string
  subject: string
  time: string
  status: 'completed' | 'current' | 'upcoming'
  room?: string
  faculty?: string
}

export interface AttendanceSummary {
  status: string
  percentage: number
}

export interface CurrentClass {
  subject: string
  room: string
  faculty: string
}

export interface NextClass {
  subject: string
  room: string
  faculty: string
  startTime: string
}

export interface Subject {
  id: string
  code: string
  name: string
  faculty: string
  room: string
  attendedClasses: number
  totalClasses: number
}

export interface AttendanceRecord {
  id: string
  subjectId: string
  date: string // YYYY-MM-DD
  status: 'Present' | 'Absent'
  timetableSlot: string
  notes?: string
}
