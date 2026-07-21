import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Info } from 'lucide-react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'

export const AboutLinkCard: React.FC = () => {
  return (
    <Card variant="default" padding="lg">
      <Link to="/about" className="flex items-center justify-between group outline-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-medium bg-brand-info/10 border border-brand-info/20 flex items-center justify-center text-brand-info">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <Typography variant="body" weight="bold" className="group-hover:text-brand-info transition-colors">
              About KAIRO
            </Typography>
            <Typography variant="caption" color="secondary">
              Version, philosophy, privacy & credits
            </Typography>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-text-primary group-hover:translate-x-0.5 transition-all" />
      </Link>
    </Card>
  )
}

export default AboutLinkCard
