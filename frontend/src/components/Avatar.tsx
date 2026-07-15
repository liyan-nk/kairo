import React, { useState } from 'react'

export type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  initials?: string
  size?: AvatarSize
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User Avatar',
  initials,
  size = 'md',
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false)

  const sizeStyles: Record<AvatarSize, string> = {
    sm: 'w-[32px] h-[32px] text-[12px]',
    md: 'w-[40px] h-[40px] text-[14px]',
    lg: 'w-[48px] h-[48px] text-[16px]',
  }

  const classes = [
    'rounded-pill overflow-hidden bg-surface-secondary text-text-primary font-semibold select-none flex items-center justify-center border border-border-card shrink-0',
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const shouldRenderImage = src && !imageError

  return (
    <div className={classes} {...props}>
      {shouldRenderImage ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="uppercase tracking-wider">{initials || '?'}</span>
      )}
    </div>
  )
}

export default Avatar
