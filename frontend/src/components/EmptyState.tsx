import React from 'react'
import Typography from './Typography'
import Button from './Button'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-card rounded-large max-w-[360px] mx-auto my-6 bg-surface ${className}`}
      {...props}
    >
      {icon && (
        <div className="w-12 h-12 rounded-pill bg-surface-secondary text-text-secondary flex items-center justify-center mb-4 shrink-0">
          <span className="w-6 h-6 inline-flex items-center justify-center">
            {icon}
          </span>
        </div>
      )}
      <Typography variant="title" weight="semibold" className="mb-2">
        {title}
      </Typography>
      <Typography variant="caption" color="secondary" className="mb-4 max-w-[280px]">
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
