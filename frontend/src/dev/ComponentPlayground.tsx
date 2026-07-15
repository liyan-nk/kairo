import React, { useState } from 'react'
import { Plus, Trash, Settings, AlertCircle, MapPin } from 'lucide-react'
import Typography from '../components/Typography'
import Button from '../components/Button'
import IconButton from '../components/IconButton'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Divider from '../components/Divider'
import Skeleton from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Avatar from '../components/Avatar'
import BottomNavigation from '../components/BottomNavigation'
import type { TabKey } from '../components/BottomNavigation'
import SegmentedControl from '../components/SegmentedControl'
import Search from '../components/Search'
import Dialog from '../components/Dialog'
import useToast from '../hooks/useToast'

export const ComponentPlayground: React.FC = () => {
  const { showToast } = useToast()
  
  // Component interactive states
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg text-text-primary p-6 pb-24 overflow-y-auto">
      <div className="max-w-[600px] mx-auto space-y-8 select-none">
        
        {/* Header */}
        <div className="space-y-1">
          <Typography variant="display">KAIRO</Typography>
          <Typography variant="title" color="secondary">
            Design System Component Playground
          </Typography>
        </div>

        <Divider />

        {/* Section: Typography */}
        <section className="space-y-4">
          <Typography variant="h3">1. Typography</Typography>
          <Card variant="outline" padding="md" className="space-y-4">
            <Typography variant="display">Display (40px)</Typography>
            <Typography variant="h1">Heading 1 (32px)</Typography>
            <Typography variant="h2">Heading 2 (28px)</Typography>
            <Typography variant="h3">Heading 3 (24px)</Typography>
            <Typography variant="title">Title (20px)</Typography>
            <Typography variant="body">Body (16px) - Reusable description body text.</Typography>
            <Typography variant="caption" color="secondary">
              Caption (14px) - Secondary caption detail labels.
            </Typography>
            <Typography variant="micro" color="secondary" className="block">
              MICRO (12px) - SMALLEST CONVENTIONAL LABELS.
            </Typography>
          </Card>
        </section>

        {/* Section: Buttons */}
        <section className="space-y-4">
          <Typography variant="h3">2. Buttons</Typography>
          <Card variant="outline" padding="md" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" icon={<Plus />} iconPosition="left">
                Icon Left
              </Button>
              <Button variant="secondary" icon={<Settings />} iconPosition="right">
                Icon Right
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
            <Button variant="primary" fullWidth>
              Full Width Button
            </Button>
          </Card>
        </section>

        {/* Section: IconButtons */}
        <section className="space-y-4">
          <Typography variant="h3">3. Icon Buttons</Typography>
          <Card variant="outline" padding="md" className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <IconButton icon={<Plus />} variant="primary" size="lg" aria-label="Add" />
              <IconButton icon={<Settings />} variant="secondary" size="md" aria-label="Settings" />
              <IconButton icon={<Trash />} variant="danger" size="sm" aria-label="Delete" />
              <IconButton icon={<Plus />} variant="tertiary" size="md" disabled aria-label="Add disabled" />
            </div>
          </Card>
        </section>

        {/* Section: Cards */}
        <section className="space-y-4">
          <Typography variant="h3">4. Cards</Typography>
          <div className="grid grid-cols-1 gap-3">
            <Card variant="default">
              <Typography variant="title" weight="semibold">Default Card</Typography>
              <Typography variant="body" color="secondary" className="mt-1">
                Fills with secondary surface color (#F6F6F7 / #1F1F1F) with zero borders.
              </Typography>
            </Card>
            <Card variant="outline">
              <Typography variant="title" weight="semibold">Outline Card</Typography>
              <Typography variant="body" color="secondary" className="mt-1">
                Light border and white backdrop.
              </Typography>
            </Card>
            <Card variant="default" onClick={() => showToast('Card Clicked ✓')}>
              <Typography variant="title" weight="semibold">Clickable Card</Typography>
              <Typography variant="body" color="secondary" className="mt-1">
                Hover triggers and active micro-scale shrink effect.
              </Typography>
            </Card>
          </div>
        </section>

        {/* Section: Badges */}
        <section className="space-y-4">
          <Typography variant="h3">5. Badges</Typography>
          <Card variant="outline" padding="md" className="space-y-3">
            <div className="space-y-1">
              <Typography variant="caption" color="secondary" className="block mb-1">Outlined (Default)</Typography>
              <div className="flex flex-wrap gap-2">
                <Badge color="secondary">Secondary</Badge>
                <Badge color="primary">Primary</Badge>
                <Badge color="info">Info</Badge>
                <Badge color="green">Green</Badge>
                <Badge color="yellow">Yellow</Badge>
                <Badge color="orange">Orange</Badge>
                <Badge color="red">Red</Badge>
              </div>
            </div>
            <div className="space-y-1">
              <Typography variant="caption" color="secondary" className="block mb-1">Filled</Typography>
              <div className="flex flex-wrap gap-2">
                <Badge variant="filled" color="secondary">Secondary</Badge>
                <Badge variant="filled" color="primary">Primary</Badge>
                <Badge variant="filled" color="info">Info</Badge>
                <Badge variant="filled" color="green">Green</Badge>
                <Badge variant="filled" color="yellow">Yellow</Badge>
                <Badge variant="filled" color="orange">Orange</Badge>
                <Badge variant="filled" color="red">Red</Badge>
              </div>
            </div>
          </Card>
        </section>

        {/* Section: Divider & Skeletons */}
        <section className="space-y-4">
          <Typography variant="h3">6. Dividers & Skeletons</Typography>
          <Card variant="outline" padding="md" className="space-y-4">
            <div className="space-y-2">
              <Typography variant="caption" color="secondary">Divider</Typography>
              <Divider />
            </div>
            <div className="space-y-3">
              <Typography variant="caption" color="secondary" className="block">Skeletons</Typography>
              <Skeleton variant="text" width="60%" />
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="80%" />
                </div>
              </div>
              <Skeleton variant="rectangular" height="80px" />
            </div>
          </Card>
        </section>

        {/* Section: Empty States */}
        <section className="space-y-4">
          <Typography variant="h3">7. Empty State</Typography>
          <EmptyState
            icon={<AlertCircle />}
            title="No Items Reported"
            description="Great! Everything is clean and synchronized today."
            actionLabel="Add Item"
            onAction={() => showToast('Action Triggered ✓')}
          />
        </section>

        {/* Section: Avatars */}
        <section className="space-y-4">
          <Typography variant="h3">8. Avatars</Typography>
          <Card variant="outline" padding="md" className="flex items-center gap-4">
            <Avatar size="sm" initials="JD" />
            <Avatar size="md" initials="JD" />
            <Avatar size="lg" initials="LN" />
            <Avatar size="lg" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar demo" />
          </Card>
        </section>

        {/* Section: Segmented Control & Search */}
        <section className="space-y-4">
          <Typography variant="h3">9. Controls & Search</Typography>
          <Card variant="outline" padding="md" className="space-y-4 flex flex-col items-center">
            <SegmentedControl
              options={['Lost & Found', 'Community Reports']}
              selectedIndex={segmentIndex}
              onChange={setSegmentIndex}
            />
            <Search
              value={searchText}
              onChange={setSearchText}
              placeholder="Search classes or items..."
            />
          </Card>
        </section>

        {/* Section: Dialog & Toasts */}
        <section className="space-y-4">
          <Typography variant="h3">10. Dialog & Toast Alerts</Typography>
          <Card variant="outline" padding="md" className="space-y-2">
            <Button variant="primary" fullWidth onClick={() => setIsDialogOpen(true)}>
              Open Dialog Card Drawer
            </Button>
            <Button variant="secondary" fullWidth onClick={() => showToast('Attendance Updated ✓')}>
              Show Simple Toast Alert
            </Button>
          </Card>
        </section>

      </div>

      {/* Reusable dialog rendering test */}
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Accessibility Dialog">
        <div className="space-y-4 py-2">
          <Typography variant="body">
            This dialog card acts as a mobile bottom drawer standard, focusing navigation traps and escaping safely.
          </Typography>
          <div className="flex items-center gap-2 text-text-secondary">
            <MapPin className="w-5 h-5 shrink-0" />
            <Typography variant="caption">Room 404, Main Academic Block</Typography>
          </div>
          <Button variant="primary" fullWidth onClick={() => {
            setIsDialogOpen(false)
            showToast('Changes Saved ✓')
          }}>
            Confirm Selection
          </Button>
        </div>
      </Dialog>

      {/* Bottom navigation layout test (fixed at base of sandbox) */}
      <BottomNavigation activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}

export default ComponentPlayground
