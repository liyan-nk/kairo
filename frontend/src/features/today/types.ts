export type ViewState = 'active' | 'loading' | 'holiday' | 'beforeFirst' | 'freePeriod' | 'dayEnded' | 'error'

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
