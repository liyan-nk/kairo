import React from 'react'

export type CardVariant = 'default' | 'outline' | 'flat'
export type CardRadius = 'medium' | 'large'
export type CardPadding = 'sm' | 'md' | 'lg' | 'none'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  radius?: CardRadius
  padding?: CardPadding
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  radius = 'medium',
  padding = 'md',
  onClick,
  children,
  className = '',
  ...props
}) => {
  const isClickable = !!onClick

  const baseStyle = 'transition-all duration-150 relative overflow-hidden'

  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-surface-secondary text-text-primary',
    outline: 'border border-border-card bg-surface text-text-primary',
    flat: 'bg-surface text-text-primary',
  }

  const radiusStyles: Record<CardRadius, string> = {
    medium: 'rounded-medium',
    large: 'rounded-large',
  }

  const paddingStyles: Record<CardPadding, string> = {
    none: 'p-0',
    sm: 'p-3', // 12px
    md: 'p-4', // 16px
    lg: 'p-6', // 24px
  }

  const interactiveStyles = isClickable
    ? 'cursor-pointer active:scale-[0.99] hover:opacity-95 select-none'
    : ''

  const classes = [
    baseStyle,
    variantStyles[variant],
    radiusStyles[radius],
    paddingStyles[padding],
    interactiveStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
              }
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
