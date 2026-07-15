import React from 'react'
import Typography from '../../../components/Typography'

export const GreetingHeader: React.FC = () => {
  const getGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getFormattedDate = (): string => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <header className="space-y-1">
      <Typography variant="h2" weight="bold">
        {getGreeting()}
      </Typography>
      <Typography variant="body" color="secondary">
        {getFormattedDate()}
      </Typography>
    </header>
  )
}

export default GreetingHeader
