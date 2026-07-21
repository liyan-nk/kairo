import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Cpu, Code2, Sparkles, MessageSquare, History, FileText } from 'lucide-react'
import Typography from '../../components/Typography'
import Card from '../../components/Card'

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200 pb-8">
      {/* Back button header */}
      <div className="flex items-center gap-3">
        <Link
          to="/profile"
          className="w-9 h-9 rounded-medium bg-surface-secondary border border-border-card flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Typography variant="h2" weight="bold">
          About KAIRO
        </Typography>
      </div>

      {/* Main Info Card */}
      <Card variant="default" padding="lg" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-large bg-brand-info/10 border border-brand-info/20 flex items-center justify-center text-brand-info shadow-sm">
            <span className="text-xl font-bold font-sans tracking-wider">K</span>
          </div>
          <div>
            <Typography variant="title" weight="bold">
              KAIRO v1.0.0
            </Typography>
            <Typography variant="caption" color="secondary">
              Daily Academic Companion
            </Typography>
          </div>
        </div>

        {/* Philosophy */}
        <div className="p-3 bg-surface-secondary/70 rounded-medium border border-border-card/50 space-y-1">
          <div className="flex items-center gap-1.5 text-brand-info font-semibold text-[13px]">
            <Sparkles className="w-4 h-4" />
            <span>Product Philosophy</span>
          </div>
          <Typography variant="body" color="primary" className="text-[14px] leading-relaxed font-medium">
            "Know the Right Moment." KAIRO delivers instantaneous answers to what matters right now without distraction.
          </Typography>
        </div>

        {/* Offline First */}
        <div className="flex items-start gap-3 pt-2">
          <Cpu className="w-5 h-5 text-brand-info shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <Typography variant="body" weight="semibold">
              Offline First Architecture
            </Typography>
            <Typography variant="caption" color="secondary" className="block leading-relaxed">
              Your attendance metrics and timetable are cached locally in IndexedDB for instant access anywhere on campus.
            </Typography>
          </div>
        </div>

        {/* Privacy */}
        <div className="flex items-start gap-3 pt-2">
          <ShieldCheck className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <Typography variant="body" weight="semibold">
              Privacy Guaranteed
            </Typography>
            <Typography variant="caption" color="secondary" className="block leading-relaxed">
              Zero trackers or external analytics. Your academic records stay on your personal device.
            </Typography>
          </div>
        </div>

        {/* Credits */}
        <div className="flex items-start gap-3 pt-2">
          <Code2 className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <Typography variant="body" weight="semibold">
              Credits
            </Typography>
            <Typography variant="caption" color="secondary" className="block leading-relaxed">
              Designed and engineered by the KAIRO Engineering Team.
            </Typography>
          </div>
        </div>
      </Card>

      {/* Placeholders Card */}
      <Card variant="default" padding="lg" className="space-y-3">
        <Typography variant="caption" color="secondary" weight="semibold" className="uppercase tracking-wider block">
          Additional Resources
        </Typography>

        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-surface-secondary/50 border border-border-card/40 rounded-medium text-[13px]">
            <div className="flex items-center gap-2 text-text-secondary font-medium">
              <History className="w-4 h-4" />
              <span>Changelog</span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary/70">Coming Soon</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-surface-secondary/50 border border-border-card/40 rounded-medium text-[13px]">
            <div className="flex items-center gap-2 text-text-secondary font-medium">
              <FileText className="w-4 h-4" />
              <span>Open Source Notices</span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary/70">Coming Soon</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-surface-secondary/50 border border-border-card/40 rounded-medium text-[13px]">
            <div className="flex items-center gap-2 text-text-secondary font-medium">
              <MessageSquare className="w-4 h-4" />
              <span>Contact</span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary/70">Coming Soon</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AboutPage
