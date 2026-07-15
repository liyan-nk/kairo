import React from 'react'

export type BadgeVariant = 'filled' | 'outlined'
export type BadgeColor =
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'info'
  | 'secondary'
  | 'primary'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  color?: BadgeColor
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'outlined',
  color = 'secondary',
  children,
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center px-2.5 py-0.5 rounded-pill text-[12px] font-semibold tracking-wide select-none leading-none h-[22px] shrink-0 border'

  const filledStyles: Record<BadgeColor, string> = {
    green: 'bg-attendance-green text-white border-transparent',
    yellow: 'bg-attendance-yellow text-[#111111] border-transparent',
    orange: 'bg-attendance-orange text-white border-transparent',
    red: 'bg-attendance-red text-white border-transparent',
    info: 'bg-brand-info text-white border-transparent',
    secondary: 'bg-surface-secondary text-text-secondary border-transparent',
    primary: 'bg-text-primary text-bg border-transparent',
  }

  const outlinedStyles: Record<BadgeColor, string> = {
    green: 'border-attendance-green text-attendance-green bg-transparent',
    yellow: 'border-attendance-yellow text-attendance-yellow bg-transparent',
    orange: 'border-attendance-orange text-attendance-orange bg-transparent',
    red: 'border-attendance-red text-attendance-red bg-transparent',
    info: 'border-brand-info text-brand-info bg-transparent',
    secondary: 'border-border-card text-text-secondary bg-transparent',
    primary: 'border-text-primary text-text-primary bg-transparent',
  }

  const classes = [
    baseStyle,
    variant === 'filled' ? filledStyles[color] : outlinedStyles[color],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}

export default Badge
