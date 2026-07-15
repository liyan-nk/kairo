import React from 'react'
import Typography from '../components/Typography'

export const SubjectsPage: React.FC = () => {
  return (
    <div className="space-y-2">
      <Typography variant="h2" weight="semibold">
        My Subjects
      </Typography>
      <Typography variant="body" color="secondary">
        Subjects page placeholder. Your courses and attendance metrics will show here.
      </Typography>
    </div>
  )
}

export default SubjectsPage
