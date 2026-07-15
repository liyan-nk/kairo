import React from 'react'
import Typography from '../components/Typography'

export const TodayPage: React.FC = () => {
  // Get contextual greeting based on current time
  const getGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Get formatted day & date (e.g., "Wednesday, July 15")
  const getFormattedDate = (): string => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6 select-none">
      {/* Dynamic Header */}
      <header className="space-y-1">
        <Typography variant="h2" weight="bold">
          {getGreeting()}
        </Typography>
        <Typography variant="body" color="secondary">
          {getFormattedDate()}
        </Typography>
      </header>

      {/* Slots for subsequent implementation commits */}
      <div className="space-y-6">
        {/* Current Class Section Slot */}
        {/* Next Class Section Slot */}
        {/* Today's Timeline Section Slot */}
        {/* Attendance Summary Section Slot */}
      </div>
    </div>
  )
}

export default TodayPage
