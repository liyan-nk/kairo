import React from 'react'
import Typography from '../components/Typography'

export const TodayPage: React.FC = () => {
  return (
    <div className="space-y-2">
      <Typography variant="h2" weight="semibold">
        Today's Schedule
      </Typography>
      <Typography variant="body" color="secondary">
        Home page placeholder. Your daily timeline and classes will show here.
      </Typography>
    </div>
  )
}

export default TodayPage
