import React from 'react'
import { Search as SearchIcon, X } from 'lucide-react'

interface SearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
}

export const Search: React.FC<SearchProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative w-full flex items-center select-text ${className}`}>
      <SearchIcon className="absolute left-4 w-5 h-5 text-text-secondary pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[48px] pl-11 pr-11 bg-surface-secondary border border-border-card rounded-medium text-[16px] text-text-primary placeholder:text-text-secondary focus:bg-surface focus:border-brand-info outline-none transition-all duration-150"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-4 w-5 h-5 text-text-secondary cursor-pointer hover:text-text-primary transition-colors duration-150 outline-none flex items-center justify-center rounded-small focus-visible:ring-1 focus-visible:ring-brand-info"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Search
