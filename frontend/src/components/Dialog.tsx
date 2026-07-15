import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import Typography from './Typography'
import IconButton from './IconButton'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

/**
 * Dialog Component using React Portals.
 *
 * ACCESSIBILITY REASONING FOR REACT PORTALS:
 * Mounting the modal directly under document.body prevents stacking context issues
 * (like parent relative z-index overlays or overflow: hidden layout clips on mobile).
 * This ensures screen reader traversal, keyboard tab traps, and modal backdrop overlays
 * behave correctly and consistently across all browsers and devices.
 */
export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Manage accessibility focus traps and keyboard events
  useEffect(() => {
    if (isOpen) {
      // Save previously focused element to restore it on close
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Shift focus to modal container for screen reader start context
      dialogRef.current?.focus()
      
      // Prevent parent page scrolling while modal is open
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      };
      
      window.addEventListener('keydown', handleKeyDown)
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
        // Restore focus
        previousFocusRef.current?.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Portal to append modal content at the root of the document
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 dark:bg-black/60 backdrop-blur-[2px] transition-opacity select-none"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-surface rounded-t-large sm:rounded-large border border-border-card w-full sm:max-w-[480px] p-6 shadow-lg max-h-[90vh] overflow-y-auto outline-none animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside card
      >
        {/* Header container */}
        <div className="flex items-center justify-between mb-4">
          <Typography variant="title" weight="semibold">
            {title}
          </Typography>
          <IconButton
            icon={<X className="w-5 h-5" />}
            variant="tertiary"
            size="sm"
            onClick={onClose}
            aria-label="Close dialog"
          />
        </div>
        
        {/* Children container */}
        <div className="select-text">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export default Dialog
