export interface ClassItem {
  id: string
  subject: string
  time: string
  status: 'completed' | 'current' | 'upcoming'
  room?: string
  faculty?: string
  day?: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
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

export type ConsensusStatus = 'Pending' | 'Likely' | 'Verified' | 'Auto Accepted'

export interface ProxyReport {
  id: string
  subjectId: string
  timetableSlotId: string
  expectedSubject: string
  actualSubject: string
  room: string
  faculty: string
  reportCount: number
  status: ConsensusStatus
  date: string // YYYY-MM-DD
  createdAt: string
}

export type LostAndFoundStatus = 'Lost' | 'Found' | 'Claimed'

export interface LostAndFoundItem {
  id: string
  title: string
  description?: string
  category: string
  location: string
  date: string // YYYY-MM-DD
  status: LostAndFoundStatus
  question: string // Descriptive validation question for claims
  contactInfo?: string
  createdAt: string
}

export interface UserProfile {
  id: string
  name: string
  rollNumber: string
  department: string
  semester: string
  section: string
  lastSyncDate?: string
  officialBaselinePercentage?: number
}
