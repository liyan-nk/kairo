import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Coffee, Sunset, AlertCircle } from 'lucide-react'
import Typography from '../../components/Typography'
import Card from '../../components/Card'
import Skeleton from '../../components/Skeleton'
import EmptyState from '../../components/EmptyState'
import useToast from '../../hooks/useToast'
import CurrentClassCard from './components/CurrentClassCard'
import Timeline from './components/Timeline'

type ViewState = 'active' | 'loading' | 'holiday' | 'beforeFirst' | 'freePeriod' | 'dayEnded' | 'error'

export const TodayPage: React.FC = () => {
  const { showToast } = useToast()
  
  // Dev-friendly state toggle for previewing empty/loading conditions
  const [viewState, setViewState] = useState<ViewState>('active')
  const [attendance, setAttendance] = useState<'present' | 'absent' | null>(null)

  // Live timer simulation states
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Run a client-side ticking timer once a second to drive the countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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

  // Calculate live countdown based on simulated start point of 10:18 AM
  // 10:18 AM is 618 minutes from midnight. End of class is 11:00 AM (660 minutes).
  const totalElapsedMinutes = Math.floor(elapsedSeconds / 60)
  const simulatedMinutesLeft = Math.max(0, 660 - (618 + totalElapsedMinutes))

  // Render Skeletons for Loading State
  if (viewState === 'loading') {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <Skeleton variant="text" width="40%" height="28px" />
          <Skeleton variant="text" width="60%" height="16px" />
        </header>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton variant="text" width="20%" />
            <Skeleton variant="rectangular" height="160px" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width="20%" />
            <Skeleton variant="rectangular" height="88px" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="rectangular" height="240px" />
          </div>
        </div>
      </div>
    )
  }

  // Render Full Screen Error State
  if (viewState === 'error') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <EmptyState
          icon={<AlertCircle className="text-brand-danger" />}
          title="Unable to Load Timetable"
          description="Something went wrong. Please check your connection and try again."
          actionLabel="Retry"
          onAction={() => setViewState('active')}
        />
      </div>
    )
  }

  // Render Full Screen Holiday / No Timetable State
  if (viewState === 'holiday') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <EmptyState
          icon={<Calendar className="text-brand-info" />}
          title="No Classes Scheduled"
          description="Enjoy your day off!"
        />
      </div>
    )
  }

  // Render Full Screen Day Ended State
  if (viewState === 'dayEnded') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <EmptyState
          icon={<Sunset className="text-brand-info" />}
          title="Classes Ended"
          description="Classes ended for today — have a great evening!"
        />
      </div>
    )
  }

  // Render Full Screen Before First Class State
  if (viewState === 'beforeFirst') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <EmptyState
          icon={<Clock className="text-brand-info" />}
          title="Morning Schedule"
          description="Your first class starts at 9:00 AM."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Dynamic Header */}
      <header className="space-y-1">
        <Typography variant="h2" weight="bold">
          {getGreeting()}
        </Typography>
        <Typography variant="body" color="secondary">
          {getFormattedDate()}
        </Typography>
      </header>

      {/* Main Content Areas */}
      <div className="space-y-6">
        
        {/* Current Class Section */}
        <section className="space-y-2">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Current Class
          </Typography>
          
          {viewState === 'freePeriod' ? (
            <EmptyState
              icon={<Coffee className="text-brand-info" />}
              title="No Class Right Now"
              description="Your next class starts at 11:15 AM."
            />
          ) : (
            <CurrentClassCard
              subject="Java Programming"
              room="Room 404"
              faculty="Dr. Sarah Jenkins"
              minutesLeft={simulatedMinutesLeft}
              attendance={attendance}
              onMarkAttendance={handleMarkAttendance}
              onReportChange={() => showToast('Discrepancy Reported ✓')}
            />
          )}
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
              <div className="text-right shrink-0">
                <Typography variant="body" weight="semibold" className="text-text-primary">
                  11:15 AM
                </Typography>
                <Typography variant="micro" color="secondary" className="block mt-0.5">
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
          <Timeline
            items={[
              { id: '1', subject: 'Java Programming', time: '09:00 AM - 10:00 AM', status: 'completed' as const },
              { id: '2', subject: 'Database Management Systems', time: '10:00 AM - 11:00 AM', status: 'current' as const },
              { id: '3', subject: 'Morning Break', time: '11:00 AM - 11:15 AM', status: 'upcoming' as const },
              { id: '4', subject: 'Operating Systems', time: '11:15 AM - 12:15 PM', status: 'upcoming' as const },
              { id: '5', subject: 'Computer Networks', time: '12:15 PM - 01:15 PM', status: 'upcoming' as const },
            ]}
          />
        </section>

        {/* Attendance Summary Section */}
        <section className="space-y-2">
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            Attendance Summary
          </Typography>
          <Card variant="default" padding="md" className="space-y-3">
            <div className="flex justify-between items-baseline">
              <Typography variant="title" weight="bold" className="text-brand-warning">
                Watch Carefully
              </Typography>
              <Typography variant="title" weight="bold">
                78%
              </Typography>
            </div>
            {/* Horizontal progress indicator */}
            <div className="w-full h-2 bg-border-card rounded-pill overflow-hidden">
              <div className="h-full bg-brand-warning rounded-pill" style={{ width: '78%' }} />
            </div>
          </Card>
        </section>
      </div>

      {/* Dev-only Switcher Panel for testing state layouts */}
      {import.meta.env.DEV && (
        <div className="mt-8 p-4 bg-surface-secondary border border-border-card rounded-medium space-y-2">
          <Typography variant="micro" color="secondary" className="block font-semibold uppercase tracking-wider">
            Dev State Previewer
          </Typography>
          <div className="flex flex-wrap gap-2">
            {(['active', 'loading', 'holiday', 'beforeFirst', 'freePeriod', 'dayEnded', 'error'] as ViewState[]).map((state) => (
              <button
                key={state}
                onClick={() => setViewState(state)}
                className={`px-2.5 py-1 text-[12px] font-medium rounded-small border transition-all ${
                  viewState === state
                    ? 'bg-text-primary text-bg border-text-primary'
                    : 'bg-surface border-border-card text-text-secondary hover:text-text-primary'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TodayPage
