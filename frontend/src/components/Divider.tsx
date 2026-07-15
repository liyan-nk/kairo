import React from 'react'

export type DividerOrientation = 'horizontal' | 'vertical'

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  const baseStyle = 'bg-border-card shrink-0'

  const orientationStyles: Record<DividerOrientation, string> = {
    horizontal: 'w-full h-[1px]',
    vertical: 'h-full w-[1px] self-stretch',
  }

  const classes = [baseStyle, orientationStyles[orientation], className]
    .filter(Boolean)
    .join(' ')

  return <div className={classes} role="separator" {...props} />
}

export default Divider
