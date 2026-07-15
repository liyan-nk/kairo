import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center rounded-medium font-semibold text-[16px] h-[48px] px-6 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2 select-none outline-none'

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-text-primary text-bg hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-info',
    secondary:
      'border border-border-card bg-transparent text-text-primary hover:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-brand-info',
    tertiary:
      'bg-transparent text-text-secondary hover:text-text-primary px-3 h-auto focus-visible:underline',
    danger:
      'bg-brand-danger text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-info',
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  const classes = [
    baseStyle,
    variantStyles[variant],
    widthStyle,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...props}>
      {icon && iconPosition === 'left' && (
        <span className="inline-flex shrink-0 items-center justify-center w-5 h-5">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="inline-flex shrink-0 items-center justify-center w-5 h-5">
          {icon}
        </span>
      )}
    </button>
  )
}

export default Button
