import React from 'react'

interface SegmentedControlProps {
  options: string[]
  selectedIndex: number
  onChange: (index: number) => void
  className?: string
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedIndex,
  onChange,
  className = '',
}) => {
  if (options.length === 0) return null

  return (
    <div
      className={`relative flex items-center p-[2px] bg-surface-secondary rounded-medium border border-border-card w-full select-none overflow-hidden ${className}`}
    >
      {/* Sliding background indicator */}
      <div
        className="absolute top-[2px] bottom-[2px] bg-surface rounded-small shadow-sm transition-all duration-250 cubic-bezier(0.4, 0, 0.2, 1)"
        style={{
          width: `calc(${100 / options.length}% - 4px)`,
          transform: `translateX(${selectedIndex * 100}%)`,
          left: '2px',
        }}
      />

      {options.map((option, index) => {
        const isActive = selectedIndex === index

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(index)}
            className={`relative z-10 flex items-center justify-center w-full h-[40px] text-[14px] font-medium transition-colors duration-150 rounded-small outline-none ${
              isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
