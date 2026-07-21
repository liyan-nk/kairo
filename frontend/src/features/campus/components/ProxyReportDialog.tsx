import React, { useState } from 'react'
import Dialog from '../../../components/Dialog'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'
import type { Subject, ClassItem } from '../../../lib/models'

interface ProxyReportDialogProps {
  isOpen: boolean
  onClose: () => void
  subjects: Subject[]
  timeline: ClassItem[]
  onSubmit: (report: {
    subjectId: string
    timetableSlotId: string
    expectedSubject: string
    actualSubject: string
    room: string
    faculty: string
  }) => void
}

export const ProxyReportDialog: React.FC<ProxyReportDialogProps> = ({
  isOpen,
  onClose,
  subjects,
  timeline,
  onSubmit,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [expectedSubject, setExpectedSubject] = useState('')
  const [actualSubjectId, setActualSubjectId] = useState('')
  const [room, setRoom] = useState('')
  const [faculty, setFaculty] = useState('')

  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slotId = e.target.value
    setSelectedSlotId(slotId)
    const slot = timeline.find((item) => item.id === slotId)
    setExpectedSubject(slot ? slot.subject : '')
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlotId || !actualSubjectId || !room.trim() || !faculty.trim()) return

    const actualSubObj = subjects.find((s) => s.id === actualSubjectId)
    if (!actualSubObj) return

    onSubmit({
      subjectId: actualSubjectId,
      timetableSlotId: selectedSlotId,
      expectedSubject,
      actualSubject: actualSubObj.name,
      room,
      faculty,
    })

    // Reset Form
    setSelectedSlotId('')
    setExpectedSubject('')
    setActualSubjectId('')
    setRoom('')
    setFaculty('')
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Report Schedule Discrepancy">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Slot Selector */}
        <div className="space-y-1.5">
          <label htmlFor="slotSelect" className="text-[13px] font-semibold text-text-secondary">
            Timetable Slot
          </label>
          <select
            id="slotSelect"
            required
            value={selectedSlotId}
            onChange={handleSlotChange}
            className="w-full bg-surface-secondary border border-border-card rounded-medium px-3.5 py-2.5 text-[14px] outline-none text-text-primary focus:border-brand-info"
          >
            <option value="">Select current/upcoming slot</option>
            {timeline.map((item) => (
              <option key={item.id} value={item.id}>
                {item.time} ({item.subject})
              </option>
            ))}
          </select>
        </div>

        {/* Expected Subject */}
        {expectedSubject && (
          <div className="space-y-1">
            <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
              Expected Subject
            </Typography>
            <Typography variant="body" weight="semibold" className="text-text-secondary line-through">
              {expectedSubject}
            </Typography>
          </div>
        )}

        {/* Actual Subject Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="actualSelect" className="text-[13px] font-semibold text-text-secondary">
            Actual Subject Held
          </label>
          <select
            id="actualSelect"
            required
            value={actualSubjectId}
            onChange={(e) => setActualSubjectId(e.target.value)}
            className="w-full bg-surface-secondary border border-border-card rounded-medium px-3.5 py-2.5 text-[14px] outline-none text-text-primary focus:border-brand-info"
          >
            <option value="">Select actual subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name} ({sub.code})
              </option>
            ))}
          </select>
        </div>

        {/* New Room */}
        <div className="space-y-1.5">
          <label htmlFor="roomInput" className="text-[13px] font-semibold text-text-secondary">
            Room
          </label>
          <input
            id="roomInput"
            type="text"
            required
            placeholder="e.g. Room 404"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full bg-surface-secondary border border-border-card rounded-medium px-3.5 py-2.5 text-[14px] outline-none text-text-primary focus:border-brand-info"
          />
        </div>

        {/* New Faculty */}
        <div className="space-y-1.5">
          <label htmlFor="facultyInput" className="text-[13px] font-semibold text-text-secondary">
            Faculty
          </label>
          <input
            id="facultyInput"
            type="text"
            required
            placeholder="e.g. Dr. Sarah Jenkins"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="w-full bg-surface-secondary border border-border-card rounded-medium px-3.5 py-2.5 text-[14px] outline-none text-text-primary focus:border-brand-info"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="flex-1">
            Submit Report
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export default ProxyReportDialog
