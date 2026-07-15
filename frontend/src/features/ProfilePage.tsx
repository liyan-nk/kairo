import React from 'react'
import Typography from '../components/Typography'

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-2">
      <Typography variant="h2" weight="semibold">
        My Profile
      </Typography>
      <Typography variant="body" color="secondary">
        Profile page placeholder. Student profile settings and configurations will show here.
      </Typography>
    </div>
  )
}

export default ProfilePage
