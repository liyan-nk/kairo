export const DB_NAME = 'kairo'
export const DB_VERSION = 2

export const STORES = {
  today: 'today',
  subjects: 'subjects',
  attendance: 'attendance',
  timetable: 'timetable',
  proxyReports: 'proxyReports',
  lostFound: 'lostFound',
  settings: 'settings',
  attendanceHistory: 'attendanceHistory',
} as const

export type StoreName = typeof STORES[keyof typeof STORES]
