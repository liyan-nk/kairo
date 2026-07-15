import React from 'react'

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'body'
  | 'caption'
  | 'micro'

export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold'

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
  as?: React.ElementType
  weight?: TypographyWeight
  color?: TypographyColor
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<TypographyVariant, string> = {
  display: 'text-[40px] tracking-[-1.2px] leading-tight',
  h1: 'text-[32px] tracking-[-0.8px] leading-snug',
  h2: 'text-[28px] tracking-[-0.6px] leading-snug',
  h3: 'text-[24px] tracking-[-0.4px] leading-normal',
  title: 'text-[20px] tracking-[-0.2px] leading-normal',
  body: 'text-[16px] leading-relaxed',
  caption: 'text-[14px] leading-normal',
  micro: 'text-[12px] leading-normal',
}

const colorStyles: Record<TypographyColor, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  success: 'text-brand-success',
  warning: 'text-brand-warning',
  danger: 'text-brand-danger',
  info: 'text-brand-info',
}

const weightStyles: Record<TypographyWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const defaultTags: Record<TypographyVariant, React.ElementType> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  title: 'h4',
  body: 'p',
  caption: 'span',
  micro: 'span',
}

const defaultWeights: Record<TypographyVariant, TypographyWeight> = {
  display: 'bold',
  h1: 'semibold',
  h2: 'semibold',
  h3: 'semibold',
  title: 'medium',
  body: 'normal',
  caption: 'normal',
  micro: 'normal',
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  as,
  weight,
  color = 'primary',
  children,
  className = '',
  ...props
}) => {
  const Component = as || defaultTags[variant]
  const selectedWeight = weight || defaultWeights[variant]

  const classes = [
    variantStyles[variant],
    colorStyles[color],
    weightStyles[selectedWeight],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}

export default Typography
