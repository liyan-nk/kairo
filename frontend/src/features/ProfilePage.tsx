import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Typography from '../components/Typography'
import Skeleton from '../components/Skeleton'
import Button from '../components/Button'
import StudentIdentityCard from './profile/components/StudentIdentityCard'
import AttendanceSyncCard from './profile/components/AttendanceSyncCard'
import AboutKairoCard from './profile/components/AboutKairoCard'
import { createProfileRepository } from '../lib/repositories'
import type { UserProfile } from '../lib/models'

export const ProfilePage: React.FC = () => {
  const profileRepo = useMemo(() => createProfileRepository(), [])

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const data = await profileRepo.getProfile()
      if (data) {
        setProfile(data)
      } else {
        setHasError(true)
      }
      setIsLoading(false)
    } catch {
      setHasError(true)
      setIsLoading(false)
    }
  }, [profileRepo])

  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        const data = await profileRepo.getProfile()
        if (active) {
          if (data) {
            setProfile(data)
          } else {
            setHasError(true)
          }
          setIsLoading(false)
        }
      } catch {
        if (active) {
          setHasError(true)
          setIsLoading(false)
        }
      }
    }
    fetchData()
    return () => {
      active = false
    }
  }, [profileRepo])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Typography variant="h2" weight="bold">My Profile</Typography>
        <Skeleton variant="rectangular" height="200px" className="rounded-large" />
        <Skeleton variant="rectangular" height="150px" className="rounded-large" />
      </div>
    )
  }

  if (hasError || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Typography variant="body" color="secondary" className="text-center">
          Failed to load profile settings.
        </Typography>
        <Button variant="secondary" onClick={loadData}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200 pb-8">
      {/* Header */}
      <Typography variant="h2" weight="bold">
        My Profile
      </Typography>

      {/* Identity card */}
      <StudentIdentityCard profile={profile} />

      {/* Sync official baseline card */}
      <AttendanceSyncCard
        lastSyncDate={profile.lastSyncDate}
        officialBaselinePercentage={profile.officialBaselinePercentage}
      />

      {/* About App details */}
      <AboutKairoCard />
    </div>
  )
}

export default ProfilePage
