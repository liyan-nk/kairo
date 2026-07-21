import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Typography from '../../components/Typography'
import Card from '../../components/Card'
import SegmentedControl from '../../components/SegmentedControl'
import Skeleton from '../../components/Skeleton'
import Button from '../../components/Button'
import { createTodayRepository } from '../../lib/repositories'
import type { ClassItem } from '../../lib/models'
import { Calendar, User, MapPin } from 'lucide-react'

// Weekdays Mon-Fri
const DAYS: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export const TimetablePage: React.FC = () => {
  const todayRepo = useMemo(() => createTodayRepository(), [])

  const [timeline, setTimeline] = useState<ClassItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Dynamically resolve default selected tab index and tomorrow/next week indicators
  const { initialTabIdx, indicator } = useMemo(() => {
    const now = new Date()
    const todayIdx = now.getDay() // 0: Sun, 1: Mon, ..., 6: Sat
    const currentMin = now.getHours() * 60 + now.getMinutes()
    const lastSlotEndMinutes = 795 // 01:15 PM in minutes

    let tabIdx: number
    let ind = ''

    if (todayIdx >= 1 && todayIdx <= 5) {
      const isEnded = currentMin >= lastSlotEndMinutes
      if (isEnded) {
        if (todayIdx === 5) {
          // Friday ended -> show Monday
          tabIdx = 0
          ind = 'Next Week (Monday)'
        } else {
          // Mon-Thu ended -> show tomorrow
          tabIdx = todayIdx // selects next weekday
          ind = `Tomorrow (${DAYS[tabIdx]})`
        }
      } else {
        // Not ended -> show today
        tabIdx = todayIdx - 1
      }
    } else {
      // Weekend -> show Monday
      tabIdx = 0
      ind = 'Next Week (Monday)'
    }

    return { initialTabIdx: tabIdx, indicator: ind }
  }, [])

  const [activeTab, setActiveTab] = useState(initialTabIdx)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const data = await todayRepo.getTimeline()
      setTimeline(data)
      setIsLoading(false)
    } catch {
      setHasError(true)
      setIsLoading(false)
    }
  }, [todayRepo])

  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        const data = await todayRepo.getTimeline()
        if (active) {
          setTimeline(data)
          setIsLoading(false)
        }
      } catch {
        if (active) {
          setHasError(true)
          setIsLoading(false)
        }
      }
    }
    fetchData()
    return () => {
      active = false
    }
  }, [todayRepo])

  const selectedDay = DAYS[activeTab]

  // Filter slots for selected day
  const filteredSlots = useMemo(() => {
    return timeline.filter((item) => item.day === selectedDay)
  }, [timeline, selectedDay])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Typography variant="h2" weight="bold">Timetable</Typography>
        <Skeleton variant="rectangular" height="48px" className="rounded-medium" />
        <Skeleton variant="rectangular" height="100px" className="rounded-large" />
        <Skeleton variant="rectangular" height="100px" className="rounded-large" />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Typography variant="body" color="secondary" className="text-center">
          Failed to load timetable.
        </Typography>
        <Button variant="secondary" onClick={loadData}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200 pb-8">
      {/* Title */}
      <div className="flex justify-between items-baseline">
        <Typography variant="h2" weight="bold">
          Timetable
        </Typography>
        {indicator && (
          <span className="px-2.5 py-0.5 text-[12px] font-semibold rounded-pill bg-brand-info/10 text-brand-info">
            {indicator}
          </span>
        )}
      </div>

      {/* Weekday segmented selector */}
      <SegmentedControl
        options={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
        selectedIndex={activeTab}
        onChange={setActiveTab}
      />

      {/* Slots Timeline list */}
      <div className="space-y-4">
        {filteredSlots.length === 0 ? (
          <div className="p-8 text-center bg-surface border border-border-card rounded-large space-y-2">
            <Calendar className="w-8 h-8 text-text-secondary mx-auto opacity-40" />
            <Typography variant="body" color="secondary" className="font-medium">
              No classes scheduled for {selectedDay}
            </Typography>
          </div>
        ) : (
          filteredSlots.map((slot) => {
            const isBreak = slot.subject.toLowerCase().includes('break') || slot.subject.toLowerCase().includes('lunch')
            
            return (
              <Card
                key={slot.id}
                variant="default"
                padding="md"
                className={`transition-all ${
                  isBreak 
                    ? 'bg-surface-secondary/40 border border-border-card/30' 
                    : 'bg-surface border border-border-card'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1 min-w-0 pr-4">
                    <Typography 
                      variant="body" 
                      weight="bold" 
                      color={isBreak ? 'secondary' : 'primary'}
                      className="truncate"
                    >
                      {slot.subject}
                    </Typography>
                    <Typography variant="caption" color="secondary" className="font-medium">
                      {slot.time}
                    </Typography>
                  </div>
                </div>

                {!isBreak && (slot.room || slot.faculty) && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 mt-2 border-t border-border-card/30 text-[13px] text-text-secondary">
                    {slot.room && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-text-secondary/70 shrink-0" />
                        <span className="font-medium">{slot.room}</span>
                      </div>
                    )}
                    {slot.faculty && (
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-text-secondary/70 shrink-0" />
                        <span className="font-medium">{slot.faculty}</span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default TimetablePage
