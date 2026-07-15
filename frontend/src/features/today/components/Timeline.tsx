import React, { Fragment } from 'react'
import Divider from '../../../components/Divider'
import TimelineItem from './TimelineItem'
import type { ClassItem } from '../../../lib/models'

interface TimelineProps {
  items: ClassItem[]
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="bg-surface rounded-medium border border-border-card p-4 space-y-4">
      {items.map((item, idx) => (
        <Fragment key={item.id}>
          <TimelineItem
            subject={item.subject}
            time={item.time}
            status={item.status}
          />
          {idx < items.length - 1 && <Divider />}
        </Fragment>
      ))}
    </div>
  )
}

export default Timeline
