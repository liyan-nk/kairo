import React from 'react'
import { HelpCircle } from 'lucide-react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import Badge from '../../../components/Badge'
import Button from '../../../components/Button'
import type { LostAndFoundItem } from '../../../lib/models'

interface LostAndFoundCardProps {
  item: LostAndFoundItem
  onClaim: (item: LostAndFoundItem) => void
}

export const LostAndFoundCard: React.FC<LostAndFoundCardProps> = ({ item, onClaim }) => {
  const getBadgeColor = (status: LostAndFoundItem['status']) => {
    switch (status) {
      case 'Lost':
        return 'red'
      case 'Found':
        return 'orange'
      case 'Claimed':
        return 'green'
      default:
        return 'secondary'
    }
  }

  return (
    <Card variant="default" padding="lg" className="space-y-3">
      {/* Header with status badge */}
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-0.5">
          <Typography variant="title" weight="bold">
            {item.title}
          </Typography>
          <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
            {item.category}
          </Typography>
        </div>
        <Badge variant="filled" color={getBadgeColor(item.status)}>
          {item.status}
        </Badge>
      </div>

      {/* Description */}
      {item.description && (
        <Typography variant="body" color="secondary">
          {item.description}
        </Typography>
      )}

      {/* Footer details */}
      <div className="flex justify-between items-center text-[13px] text-text-secondary pt-1">
        <div>
          Location: <span className="font-semibold text-text-primary">{item.location}</span>
        </div>
        <div>
          Date: <span className="font-medium text-text-primary">{item.date}</span>
        </div>
      </div>

      {/* Claim Option */}
      {item.status === 'Found' && (
        <div className="pt-2 border-t border-border-card/40 flex justify-end">
          <Button
            variant="secondary"
            onClick={() => onClaim(item)}
            className="flex items-center gap-1.5 h-[36px] px-3 text-[13px]"
          >
            <HelpCircle className="w-4 h-4 text-brand-info" />
            <span>Claim Item</span>
          </Button>
        </div>
      )}
    </Card>
  )
}

export default LostAndFoundCard
