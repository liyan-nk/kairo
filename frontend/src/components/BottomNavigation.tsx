import React from 'react'
import { Home, BookOpen, School, User } from 'lucide-react'

export type TabKey = 'home' | 'subjects' | 'campus' | 'profile'

interface BottomNavigationProps {
  activeTab: TabKey
  onChange: (tab: TabKey) => void
  className?: string
}

interface NavItem {
  key: TabKey
  label: string
  icon: React.FC<{ className?: string }>
}

const navItems: NavItem[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'subjects', label: 'Subjects', icon: BookOpen },
  { key: 'campus', label: 'Campus', icon: School },
  { key: 'profile', label: 'Profile', icon: User },
]

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 h-[64px] bg-surface border-t border-border-card flex items-center justify-around z-40 select-none pb-safe ${className}`}
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.key

        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-150 active:scale-95 outline-none ${
              isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
            aria-label={item.label}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[12px] font-medium mt-1">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNavigation
