import type { ClassItem } from '../../../lib/models'

export const getMockCurrentClass = () => {
  return {
    subject: 'Java Programming',
    room: 'Room 404',
    faculty: 'Dr. Sarah Jenkins',
  }
}

export const getMockNextClass = () => {
  return {
    subject: 'Database Management Systems',
    room: 'Room 102',
    faculty: 'Prof. Alok Verma',
    startTime: '11:15 AM',
  }
}

export const getMockTimeline = (): ClassItem[] => {
  return [
    { id: '1', subject: 'Java Programming', time: '09:00 AM - 10:00 AM', status: 'completed' },
    { id: '2', subject: 'Database Management Systems', time: '10:00 AM - 11:00 AM', status: 'current' },
    { id: '3', subject: 'Morning Break', time: '11:00 AM - 11:15 AM', status: 'upcoming' },
    { id: '4', subject: 'Operating Systems', time: '11:15 AM - 12:15 PM', status: 'upcoming' },
    { id: '5', subject: 'Computer Networks', time: '12:15 PM - 01:15 PM', status: 'upcoming' },
  ]
}
