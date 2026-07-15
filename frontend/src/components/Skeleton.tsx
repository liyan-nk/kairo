import React from 'react'

export type SkeletonVariant = 'text' | 'circular' | 'rectangular'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  width?: string
  height?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const baseStyle = 'animate-pulse bg-border-card/50 select-none pointer-events-none'

  const variantStyles: Record<SkeletonVariant, string> = {
    text: 'rounded h-4 w-full',
    circular: 'rounded-pill',
    rectangular: 'rounded-medium',
  }

  const customStyle: React.CSSProperties = {
    width: width || (variant === 'circular' ? '40px' : undefined),
    height: height || (variant === 'circular' ? '40px' : undefined),
    ...style,
  }

  const classes = [baseStyle, variantStyles[variant], className]
    .filter(Boolean)
    .join(' ')

  return <div className={classes} style={customStyle} {...props} />
}

export default Skeleton
