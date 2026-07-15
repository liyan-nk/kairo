import React from 'react'
import Typography from '../components/Typography'

import Card from '../components/Card'
import Button from '../components/Button'
import useToast from '../hooks/useToast'

export const TodayPage: React.FC = () => {
  const { showToast } = useToast()
  
  // Local state for interactive attendance toggle testing
  const [attendance, setAttendance] = React.useState<'present' | 'absent' | null>(null)

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

  const handleMarkAttendance = (status: 'present' | 'absent') => {
    setAttendance(status)
    showToast('Attendance Updated ✓')
    if (navigator.vibrate) {
      navigator.vibrate(10) // Light haptic tick
    }
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
        {/* Current Class Section */}
        <section className="space-y-2">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Current Class
          </Typography>
          <Card variant="default" padding="lg" className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <Typography variant="title" weight="bold">
                  Java Programming
                </Typography>
                <Typography variant="caption" color="secondary">
                  Dr. Sarah Jenkins · Room 404
                </Typography>
              </div>
              <div className="text-right">
                <Typography variant="h3" weight="bold" className="text-brand-info">
                  42m
                </Typography>
                <Typography variant="micro" color="secondary" className="block">
                  remaining
                </Typography>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={attendance === 'present' ? 'primary' : 'secondary'}
                fullWidth
                onClick={() => handleMarkAttendance('present')}
              >
                Present
              </Button>
              <Button
                variant={attendance === 'absent' ? 'danger' : 'secondary'}
                fullWidth
                onClick={() => handleMarkAttendance('absent')}
              >
                Absent
              </Button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => showToast('Discrepancy Reported ✓')}
                className="text-text-secondary hover:text-text-primary text-[14px] font-medium transition-colors cursor-pointer outline-none rounded-small focus-visible:ring-1 focus-visible:ring-brand-info px-2 py-1"
              >
                Report Change
              </button>
            </div>
          </Card>
        </section>

        {/* Next Class Section Slot */}
        {/* Today's Timeline Section Slot */}
        {/* Attendance Summary Section Slot */}
      </div>
    </div>
  )
}

export default TodayPage
