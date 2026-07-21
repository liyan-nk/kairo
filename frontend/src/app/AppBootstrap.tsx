import React from 'react'
import Typography from '../components/Typography'

export const AppBootstrap: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-200">
      <div className="flex flex-col items-center space-y-4 text-center">
        {/* Brand Icon / Logo */}
        <div className="w-16 h-16 rounded-large bg-brand-info/10 border border-brand-info/20 flex items-center justify-center text-brand-info shadow-sm">
          <span className="text-2xl font-bold font-sans tracking-wider">K</span>
        </div>

        <div className="space-y-1">
          <Typography variant="h2" weight="bold" className="tracking-tight">
            KAIRO
          </Typography>
          <Typography variant="caption" color="secondary" className="block text-[13px]">
            Academic Companion
          </Typography>
        </div>

        {/* Pulse Loader */}
        <div className="pt-6 flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-brand-info animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-brand-info animate-pulse [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-brand-info animate-pulse [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

export default AppBootstrap
