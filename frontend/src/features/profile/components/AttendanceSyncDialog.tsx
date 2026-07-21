import React, { useState } from 'react'
import Dialog from '../../../components/Dialog'
import Button from '../../../components/Button'

interface AttendanceSyncDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (percentage: number) => void
}

export const AttendanceSyncDialog: React.FC<AttendanceSyncDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [percentageStr, setPercentageStr] = useState('')

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pct = parseFloat(percentageStr)
    if (isNaN(pct) || pct < 0 || pct > 100) return

    onSubmit(pct)
    setPercentageStr('')
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Sync Official Attendance">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="percentageInput" className="text-[13px] font-semibold text-text-secondary">
            Official Attendance Percentage (%)
          </label>
          <input
            id="percentageInput"
            type="number"
            min="0"
            max="100"
            step="1"
            required
            placeholder="e.g. 80"
            value={percentageStr}
            onChange={(e) => setPercentageStr(e.target.value)}
            className="w-full bg-surface-secondary border border-border-card rounded-medium px-3.5 py-2.5 text-[14px] outline-none text-text-primary focus:border-brand-info"
          />
        </div>

        <div className="pt-2 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="flex-1">
            Sync Baseline
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export default AttendanceSyncDialog
