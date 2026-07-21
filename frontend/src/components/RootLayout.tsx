import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'
import type { TabKey } from './BottomNavigation'

export const RootLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Map route pathname to the active TabKey
  const getActiveTab = (): TabKey => {
    const path = location.pathname
    if (path.startsWith('/timetable')) return 'timetable'
    if (path.startsWith('/subjects')) return 'subjects'
    if (path.startsWith('/campus')) return 'campus'
    if (path.startsWith('/profile')) return 'profile'
    return 'home'
  }

  const handleTabChange = (tab: TabKey) => {
    if (tab === 'home') {
      navigate('/')
    } else {
      navigate(`/${tab}`)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col relative pb-[calc(64px+env(safe-area-inset-bottom,0px))] max-w-[480px] mx-auto border-x border-border-card">
      {/* Reusable scrollable page viewport area */}
      <main className="flex-1 w-full px-4 py-6 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>

      {/* Bottom navbar */}
      <BottomNavigation activeTab={getActiveTab()} onChange={handleTabChange} />
    </div>
  )
}

export default RootLayout
