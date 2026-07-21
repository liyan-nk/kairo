import React, { Fragment } from 'react'
import Divider from '../../../components/Divider'
import TimelineItem from './TimelineItem'
import type { ClassItem } from '../../../lib/models'

interface TimelineProps {
  items: ClassItem[]
  onEditItem?: (item: ClassItem) => void
}

export const Timeline: React.FC<TimelineProps> = ({ items, onEditItem }) => {
  return (
    <div className="bg-surface rounded-medium border border-border-card p-4 space-y-4">
      {items.map((item, idx) => {
        const isBreak = item.subject.toLowerCase().includes('break') || item.subject.toLowerCase().includes('lunch')

        return (
          <Fragment key={item.id}>
            <TimelineItem
              subject={item.subject}
              time={item.time}
              status={item.status}
              onEdit={!isBreak && onEditItem ? () => onEditItem(item) : undefined}
            />
            {idx < items.length - 1 && <Divider />}
          </Fragment>
        )
      })}
    </div>
  )
}

export default Timeline
