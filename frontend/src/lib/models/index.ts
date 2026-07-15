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
