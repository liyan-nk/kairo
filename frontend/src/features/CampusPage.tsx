import React from 'react'
import Typography from '../components/Typography'

export const CampusPage: React.FC = () => {
  return (
    <div className="space-y-2">
      <Typography variant="h2" weight="semibold">
        Campus Life
      </Typography>
      <Typography variant="body" color="secondary">
        Campus page placeholder. Lost & Found and proxy changes will show here.
      </Typography>
    </div>
  )
}

export default CampusPage
