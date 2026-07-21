import React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import { useTheme } from '../../../app/ThemeContext'
import type { ThemeOption } from '../../../app/ThemeContext'

export const AppearanceCard: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const options: { key: ThemeOption; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'Light', label: 'Light', icon: Sun },
    { key: 'Dark', label: 'Dark', icon: Moon },
    { key: 'System', label: 'System', icon: Monitor },
  ]

  return (
    <Card variant="default" padding="lg" className="space-y-4">
      <Typography variant="title" weight="bold">
        Appearance
      </Typography>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const Icon = opt.icon
          const isActive = theme === opt.key
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setTheme(opt.key)}
              className={`flex flex-col items-center justify-center p-3 rounded-medium border transition-all duration-150 outline-none ${
                isActive
                  ? 'bg-brand-info/10 border-brand-info text-brand-info font-bold'
                  : 'bg-surface-secondary border-border-card text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[13px]">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}

export default AppearanceCard
