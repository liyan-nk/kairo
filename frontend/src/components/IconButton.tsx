import React from 'react'

export type IconButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger'
export type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  variant?: IconButtonVariant
  size?: IconButtonSize
  'aria-label': string // Force accessibility label for icon-only buttons
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'secondary',
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center rounded-medium transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none outline-none shrink-0'

  const variantStyles: Record<IconButtonVariant, string> = {
    primary:
      'bg-text-primary text-bg hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-info',
    secondary:
      'border border-border-card bg-transparent text-text-primary hover:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-brand-info',
    tertiary:
      'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-brand-info',
    danger:
      'bg-brand-danger text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-info',
  }

  const sizeStyles: Record<IconButtonSize, string> = {
    sm: 'w-[44px] h-[44px]',
    md: 'w-[48px] h-[48px]',
    lg: 'w-[52px] h-[52px]',
  }

  const classes = [
    baseStyle,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} aria-label={ariaLabel} {...props}>
      <span className="w-5 h-5 inline-flex items-center justify-center">
        {icon}
      </span>
    </button>
  )
}

export default IconButton
