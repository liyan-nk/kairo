import React from 'react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import type { UserProfile } from '../../../lib/models'

interface StudentIdentityCardProps {
  profile: UserProfile
}

export const StudentIdentityCard: React.FC<StudentIdentityCardProps> = ({ profile }) => {
  return (
    <Card variant="default" padding="lg" className="space-y-4">
      {/* Header */}
      <div>
        <Typography variant="title" weight="bold">
          Student Identity
        </Typography>
        <Typography variant="caption" color="secondary">
          Academic registration details
        </Typography>
      </div>

      {/* Identity details */}
      <div className="space-y-3 pt-1">
        <div className="flex justify-between items-center text-[14px]">
          <span className="text-text-secondary font-medium">Name</span>
          <span className="text-text-primary font-bold">{profile.name}</span>
        </div>
        <div className="flex justify-between items-center text-[14px]">
          <span className="text-text-secondary font-medium">Roll Number</span>
          <span className="text-text-primary font-mono font-semibold">{profile.rollNumber}</span>
        </div>
        <div className="flex justify-between items-center text-[14px]">
          <span className="text-text-secondary font-medium">Department</span>
          <span className="text-text-primary font-semibold text-right">{profile.department}</span>
        </div>
        <div className="flex justify-between items-center text-[14px]">
          <span className="text-text-secondary font-medium">Semester</span>
          <span className="text-text-primary font-semibold">{profile.semester}</span>
        </div>
        <div className="flex justify-between items-center text-[14px]">
          <span className="text-text-secondary font-medium">Section</span>
          <span className="text-text-primary font-semibold">{profile.section}</span>
        </div>
      </div>
    </Card>
  )
}

export default StudentIdentityCard
