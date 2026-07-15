import React from 'react'
import Typography from '../components/Typography'

import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Divider from '../components/Divider'
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

        {/* Next Class Section */}
        <section className="space-y-2">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Next Class
          </Typography>
          <Card variant="outline" padding="md">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <Typography variant="title" weight="semibold">
                  Database Management Systems
                </Typography>
                <Typography variant="caption" color="secondary">
                  Prof. Alok Verma · Room 102
                </Typography>
              </div>
              <div className="text-right">
                <Typography variant="body" weight="semibold" className="text-text-primary">
                  11:15 AM
                </Typography>
                <Typography variant="micro" color="secondary" className="block">
                  starts
                </Typography>
              </div>
            </div>
          </Card>
        </section>

        {/* Today's Timeline Section */}
        <section className="space-y-3">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Today's Timeline
          </Typography>
          <div className="bg-surface rounded-medium border border-border-card p-4 space-y-4">
            {[
              { id: '1', subject: 'Java Programming', time: '09:00 AM - 10:00 AM', status: 'completed' as const },
              { id: '2', subject: 'Database Management Systems', time: '10:00 AM - 11:00 AM', status: 'current' as const },
              { id: '3', subject: 'Morning Break', time: '11:00 AM - 11:15 AM', status: 'upcoming' as const },
              { id: '4', subject: 'Operating Systems', time: '11:15 AM - 12:15 PM', status: 'upcoming' as const },
              { id: '5', subject: 'Computer Networks', time: '12:15 PM - 01:15 PM', status: 'upcoming' as const },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center justify-between py-1">
                  <div className="space-y-1">
                    <Typography
                      variant="body"
                      weight={item.status === 'current' ? 'semibold' : 'normal'}
                      color={item.status === 'completed' ? 'secondary' : 'primary'}
                    >
                      {item.subject}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {item.time}
                    </Typography>
                  </div>
                  <div>
                    {item.status === 'completed' && (
                      <Badge variant="filled" color="secondary">
                        Completed
                      </Badge>
                    )}
                    {item.status === 'current' && (
                      <Badge variant="filled" color="primary">
                        Current
                      </Badge>
                    )}
                    {item.status === 'upcoming' && (
                      <Badge variant="outlined" color="secondary">
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </div>
                {idx < arr.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Attendance Summary Section Slot */}
      </div>
    </div>
  )
}

export default TodayPage
