import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import EmptyState from '../components/EmptyState'

export const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <EmptyState
        icon={<FileQuestion className="text-brand-info" />}
        title="Page Not Found"
        description="The screen you are looking for does not exist or has been moved."
        actionLabel="Go to Home"
        onAction={() => navigate('/')}
      />
    </div>
  )
}

export default NotFound
