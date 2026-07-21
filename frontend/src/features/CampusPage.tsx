import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Plus } from 'lucide-react'
import Typography from '../components/Typography'
import SegmentedControl from '../components/SegmentedControl'
import Search from '../components/Search'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import Skeleton from '../components/Skeleton'
import ProxyReportCard from './campus/components/ProxyReportCard'
import ProxyReportDialog from './campus/components/ProxyReportDialog'
import LostAndFoundCard from './campus/components/LostAndFoundCard'
import FoundItemDialog from './campus/components/FoundItemDialog'
import { useToast } from '../hooks/useToast'
import {
  createCampusRepository,
  createSubjectRepository,
  createTodayRepository,
} from '../lib/repositories'
import type { ProxyReport, LostAndFoundItem, Subject, ClassItem } from '../lib/models'

export const CampusPage: React.FC = () => {
  const campusRepo = useMemo(() => createCampusRepository(), [])
  const subjectRepo = useMemo(() => createSubjectRepository(), [])
  const todayRepo = useMemo(() => createTodayRepository(), [])
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState(0) // 0: Schedule, 1: Lost & Found
  const [reports, setReports] = useState<ProxyReport[]>([])
  const [items, setItems] = useState<LostAndFoundItem[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [timeline, setTimeline] = useState<ClassItem[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Dialog states
  const [isProxyOpen, setIsProxyOpen] = useState(false)
  const [isItemOpen, setIsItemOpen] = useState(false)
  const [claimTarget, setClaimTarget] = useState<LostAndFoundItem | null>(null)

  // Lost & found search/filter
  const [searchQuery, setSearchQuery] = useState('')

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const [reportsData, itemsData, subjectsData, timelineData] = await Promise.all([
        campusRepo.getProxyReports(),
        campusRepo.getLostAndFoundItems(),
        subjectRepo.getSubjects(),
        todayRepo.getTimeline(),
      ])
      setReports(reportsData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
      setItems(itemsData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
      setSubjects(subjectsData)
      setTimeline(timelineData)
      setIsLoading(false)
    } catch {
      setHasError(true)
      setIsLoading(false)
    }
  }, [campusRepo, subjectRepo, todayRepo])

  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        const [reportsData, itemsData, subjectsData, timelineData] = await Promise.all([
          campusRepo.getProxyReports(),
          campusRepo.getLostAndFoundItems(),
          subjectRepo.getSubjects(),
          todayRepo.getTimeline(),
        ])
        if (active) {
          setReports(reportsData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
          setItems(itemsData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
          setSubjects(subjectsData)
          setTimeline(timelineData)
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
  }, [campusRepo, subjectRepo, todayRepo])

  // Handle schedule discrepancy submit
  const handleProxySubmit = async (form: {
    subjectId: string
    timetableSlotId: string
    expectedSubject: string
    actualSubject: string
    room: string
    faculty: string
  }) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0]
      await campusRepo.submitProxyReport({
        ...form,
        date: todayStr,
      })
      showToast('Discrepancy report submitted successfully')
      loadData()
    } catch {
      showToast('Failed to submit report')
    }
  }

  // Handle verify / vote report
  const handleVerifyReport = async (id: string) => {
    try {
      await campusRepo.confirmProxyReport(id)
      showToast('Verification logged successfully')
      loadData()
    } catch {
      showToast('Failed to confirm report')
    }
  }

  // Handle lost/found report submit
  const handleItemSubmit = async (form: {
    title: string
    description: string
    category: string
    location: string
    date: string
    question: string
    contactInfo: string
  }) => {
    try {
      await campusRepo.submitLostAndFoundItem(form)
      showToast('Item report logged successfully')
      loadData()
    } catch {
      showToast('Failed to log item report')
    }
  }

  // Handle claim lost item
  const handleClaimSubmit = async (itemId: string, answer: string) => {
    try {
      const success = await campusRepo.claimItem(itemId, answer)
      if (success) {
        showToast('Claim verification submitted successfully')
        loadData()
      } else {
        showToast('Invalid claim verification info')
      }
    } catch {
      showToast('Failed to log claim')
    }
  }

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [items, searchQuery])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Typography variant="h2" weight="bold">Campus Life</Typography>
        <Skeleton variant="rectangular" height="48px" className="rounded-medium" />
        <Skeleton variant="rectangular" height="180px" className="rounded-large" />
        <Skeleton variant="rectangular" height="180px" className="rounded-large" />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Typography variant="body" color="secondary" className="text-center">
          Failed to load campus updates.
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
      <div className="flex justify-between items-center">
        <Typography variant="h2" weight="bold">
          Campus Life
        </Typography>
        <Button
          variant="primary"
          onClick={() => (activeTab === 0 ? setIsProxyOpen(true) : setIsItemOpen(true))}
          className="flex items-center gap-1 h-[36px] px-3 text-[13px]"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 0 ? 'Report Proxy' : 'Log Item'}</span>
        </Button>
      </div>

      {/* Tabs */}
      <SegmentedControl
        options={['Schedule Updates', 'Lost & Found']}
        selectedIndex={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === 0 ? (
        <section className="space-y-4">
          {reports.length === 0 ? (
            <EmptyState
              title="No active schedule updates"
              description="Schedules are normal. Use proxy button above to report a discrepancy."
            />
          ) : (
            reports.map((report) => (
              <ProxyReportCard
                key={report.id}
                report={report}
                onVerify={handleVerifyReport}
              />
            ))
          )}
        </section>
      ) : (
        <section className="space-y-4">
          {/* Search bar */}
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search category, location, title..."
          />

          {filteredItems.length === 0 ? (
            <EmptyState
              title="No lost & found logs match"
              description="Try adjusting your search criteria or report a new item above."
            />
          ) : (
            filteredItems.map((item) => (
              <LostAndFoundCard
                key={item.id}
                item={item}
                onClaim={(t) => {
                  setClaimTarget(t)
                  setIsItemOpen(true)
                }}
              />
            ))
          )}
        </section>
      )}

      {/* Dialogs */}
      <ProxyReportDialog
        isOpen={isProxyOpen}
        onClose={() => setIsProxyOpen(false)}
        subjects={subjects}
        timeline={timeline}
        onSubmit={handleProxySubmit}
      />

      <FoundItemDialog
        isOpen={isItemOpen}
        onClose={() => {
          setIsItemOpen(false)
          setClaimTarget(null)
        }}
        claimItem={claimTarget}
        onClaimSubmit={handleClaimSubmit}
        onReportSubmit={handleItemSubmit}
      />
    </div>
  )
}

export default CampusPage
