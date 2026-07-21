import React from 'react'
import { Info, ShieldAlert } from 'lucide-react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'

export const AboutKairoCard: React.FC = () => {
  return (
    <Card variant="default" padding="lg" className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Info className="w-5 h-5 text-text-secondary" />
        <div className="space-y-0.5">
          <Typography variant="title" weight="bold">
            About KAIRO
          </Typography>
          <Typography variant="caption" color="secondary">
            v1.0.0 (PWA) • Offline Academic Companion
          </Typography>
        </div>
      </div>

      {/* Philosophy note */}
      <div className="p-3 bg-surface-secondary/70 rounded-medium space-y-1 border border-border-card/50">
        <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
          Core Philosophy
        </Typography>
        <Typography variant="body" className="italic text-text-secondary">
          "Know the Right Moment." KAIRO is built to give students instant schedule awareness and real-time attendance insights with a single glance.
        </Typography>
      </div>

      {/* Offline Guarantee */}
      <div className="flex gap-2.5 items-start text-text-secondary">
        <ShieldAlert className="w-4 h-4 text-brand-info shrink-0 mt-0.5" />
        <Typography variant="caption" color="secondary">
          All academic data remains strictly on-device inside private local databases. No details are transmitted or shared.
        </Typography>
      </div>
    </Card>
  )
}

export default AboutKairoCard
