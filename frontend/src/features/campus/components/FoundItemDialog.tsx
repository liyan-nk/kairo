import React, { useState } from 'react'
import Dialog from '../../../components/Dialog'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'
import type { LostAndFoundItem } from '../../../lib/models'

interface FoundItemDialogProps {
  isOpen: boolean
  onClose: () => void
  claimItem: LostAndFoundItem | null
  onClaimSubmit: (itemId: string, answer: string) => void
  onReportSubmit: (item: {
    title: string
    description: string
    category: string
    location: string
    date: string
    question: string
    contactInfo: string
  }) => void
}

export const FoundItemDialog: React.FC<FoundItemDialogProps> = ({
  isOpen,
  onClose,
  claimItem,
  onClaimSubmit,
  onReportSubmit,
}) => {
  const [answer, setAnswer] = useState('')

  // Report fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Personal Items')
  const [location, setLocation] = useState('')
  const [question, setQuestion] = useState('')
  const [contactInfo, setContactInfo] = useState('')

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!claimItem || !answer.trim()) return
    onClaimSubmit(claimItem.id, answer)
    setAnswer('')
    onClose()
  }

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !location.trim() || !question.trim()) return

    onReportSubmit({
      title,
      description,
      category,
      location,
      date: new Date().toISOString().split('T')[0],
      question,
      contactInfo,
    })

    // Reset Form
    setTitle('')
    setDescription('')
    setCategory('Personal Items')
    setLocation('')
    setQuestion('')
    setContactInfo('')
    onClose()
  }

  if (claimItem) {
    return (
      <Dialog isOpen={isOpen} onClose={onClose} title="Claim Lost Item">
        <form onSubmit={handleClaimSubmit} className="space-y-4">
          <div className="space-y-2 p-3 bg-surface-secondary/70 rounded-medium border border-border-card/50">
            <Typography variant="micro" color="secondary" weight="semibold" className="uppercase tracking-wider">
              Verification Question
            </Typography>
            <Typography variant="body" weight="semibold">
              {claimItem.question}
            </Typography>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="answerInput" className="text-[13px] font-semibold text-text-secondary">
              Your Answer
            </label>
            <input
              id="answerInput"
              type="text"
              required
              placeholder="Provide a description to verify ownership..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full bg-surface-secondary border border-border-card rounded-medium px-3.5 py-2.5 text-[14px] outline-none text-text-primary focus:border-brand-info"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex-1">
              Submit Claim
            </Button>
          </div>
        </form>
      </Dialog>
    )
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Report Campus Item">
      <form onSubmit={handleReportSubmit} className="space-y-4">
        {/* Item Title */}
        <div className="space-y-1.5">
          <label htmlFor="itemTitle" className="text-[13px] font-semibold text-text-secondary">
            Item Name
          </label>
          <input
            id="itemTitle"
            type="text"
            required
            placeholder="e.g. Blue Water Bottle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-secondary border border-border-card rounded-medium px-3.5 py-2.5 text-[14px] outline-none text-text-primary focus:border-brand-info"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label htmlFor="itemCategory" className="text-[13px] font-semibold text-text-secondary">
            Category
          </label>
          <select
            id="itemCategory"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-surface-secondary border border-border-card rounded-medium px-3.5 py-2.5 text-[14px] outline-none text-text-primary focus:border-brand-info"
          >
            <option value="Personal Items">Personal Items</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor="itemDesc" className="text-[13px] font-semibold text-text-secondary">
            Description
          </label>
          <textarea
            id="itemDesc"
            rows={2}
            placeholder="Provide additional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-secondary border border-border-card rounded-medium px-3.5 py-2.5 text-[14px] outline-none text-text-primary focus:border-brand-info resize-none"
          />
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label htmlFor="itemLoc" className="text-[13px] font-semibold text-text-secondary">
            Found/Lost Location
          </label>
          <input
            id="itemLoc"
            type="text"
            required
            placeholder="e.g. Canteen area"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-surface-secondary border border-border-card rounded-medium px-3.5 py-2.5 text-[14px] outline-none text-text-primary focus:border-brand-info"
          />
        </div>

        {/* Verification Question */}
        <div className="space-y-1.5">
          <label htmlFor="itemQuest" className="text-[13px] font-semibold text-text-secondary">
            Verification Question for Claimants
          </label>
          <input
            id="itemQuest"
            type="text"
            required
            placeholder="e.g. What sticker is pasted on the side?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full bg-surface-secondary border border-border-card rounded-medium px-3.5 py-2.5 text-[14px] outline-none text-text-primary focus:border-brand-info"
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5">
          <label htmlFor="itemContact" className="text-[13px] font-semibold text-text-secondary">
            Contact / Roll (Optional)
          </label>
          <input
            id="itemContact"
            type="text"
            placeholder="e.g. Roll CS-203"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
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

export default FoundItemDialog
