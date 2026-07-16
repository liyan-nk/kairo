import React from 'react'
import AttendanceHistoryItem from './AttendanceHistoryItem'
import type { AttendanceRecord } from '../../../lib/models'

interface AttendanceHistoryListProps {
  history: AttendanceRecord[]
}

/**
 * Scrollable/vertical list for chronological attendance log entries.
 */
export const AttendanceHistoryList: React.FC<AttendanceHistoryListProps> = ({
  history,
}) => {
  return (
    <div className="space-y-3">
      {history.map((record) => (
        <AttendanceHistoryItem key={record.id} record={record} />
      ))}
    </div>
  )
}

export default AttendanceHistoryList
