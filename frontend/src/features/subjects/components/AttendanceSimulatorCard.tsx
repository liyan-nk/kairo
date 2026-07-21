import React, { useState } from 'react'
import { Plus, Minus, RotateCcw, Sparkles } from 'lucide-react'
import Typography from '../../../components/Typography'
import type { Subject } from '../../../lib/models'
import { simulateAttendance, type SimulationResult } from '../utils/attendanceForecast'

type QuickScenario = 'none' | 'attend1' | 'miss1' | 'attend3' | 'miss3' | 'custom'

interface AttendanceSimulatorCardProps {
  subject: Subject
  onSimulationChange?: (result: SimulationResult | null) => void
}

export const AttendanceSimulatorCard: React.FC<AttendanceSimulatorCardProps> = ({
  subject,
  onSimulationChange,
}) => {
  const [scenario, setScenario] = useState<QuickScenario>('none')
  const [customAttend, setCustomAttend] = useState(0)
  const [customMiss, setCustomMiss] = useState(0)

  let attendOffset: number
  let missOffset: number

  switch (scenario) {
    case 'attend1':
      attendOffset = 1
      missOffset = 0
      break
    case 'miss1':
      attendOffset = 0
      missOffset = 1
      break
    case 'attend3':
      attendOffset = 3
      missOffset = 0
      break
    case 'miss3':
      attendOffset = 0
      missOffset = 3
      break
    case 'custom':
      attendOffset = customAttend
      missOffset = customMiss
      break
    default:
      attendOffset = 0
      missOffset = 0
      break
  }

  const isSimulating = scenario !== 'none' && (attendOffset > 0 || missOffset > 0)
  const result: SimulationResult | null = isSimulating
    ? simulateAttendance(subject, attendOffset, missOffset)
    : null

  // Notify parent of simulation changes
  React.useEffect(() => {
    onSimulationChange?.(result)
  }, [result, onSimulationChange])

  const realPercentage = subject.totalClasses > 0
    ? Math.round((subject.attendedClasses / subject.totalClasses) * 100)
    : 0

  const handleReset = () => {
    setScenario('none')
    setCustomAttend(0)
    setCustomMiss(0)
  }

  const handleSelectScenario = (selected: QuickScenario) => {
    setScenario(selected)
    if (selected !== 'custom') {
      setCustomAttend(0)
      setCustomMiss(0)
    }
  }

  const statusColorMap = {
    green: 'text-attendance-green bg-attendance-green/10 border-attendance-green/20',
    yellow: 'text-attendance-yellow bg-attendance-yellow/10 border-attendance-yellow/20',
    orange: 'text-attendance-orange bg-attendance-orange/10 border-attendance-orange/20',
    red: 'text-attendance-red bg-attendance-red/10 border-attendance-red/20',
  }

  return (
    <div className="p-5 bg-surface border border-border-card rounded-large space-y-4 shadow-sm select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-info shrink-0" />
          <Typography variant="body" weight="semibold">
            Attendance Simulator
          </Typography>
        </div>
        {isSimulating && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[12px] font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Quick Scenario Selector Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleSelectScenario('attend1')}
          className={`py-2 px-2 text-[12px] font-medium rounded-medium border transition-all ${
            scenario === 'attend1'
              ? 'bg-attendance-green/15 text-attendance-green border-attendance-green/30 font-semibold'
              : 'bg-surface-secondary border-border-card text-text-secondary hover:text-text-primary'
          }`}
        >
          +1 Attend
        </button>
        <button
          onClick={() => handleSelectScenario('miss1')}
          className={`py-2 px-2 text-[12px] font-medium rounded-medium border transition-all ${
            scenario === 'miss1'
              ? 'bg-attendance-red/15 text-attendance-red border-attendance-red/30 font-semibold'
              : 'bg-surface-secondary border-border-card text-text-secondary hover:text-text-primary'
          }`}
        >
          +1 Miss
        </button>
        <button
          onClick={() => handleSelectScenario('attend3')}
          className={`py-2 px-2 text-[12px] font-medium rounded-medium border transition-all ${
            scenario === 'attend3'
              ? 'bg-attendance-green/15 text-attendance-green border-attendance-green/30 font-semibold'
              : 'bg-surface-secondary border-border-card text-text-secondary hover:text-text-primary'
          }`}
        >
          +3 Attend
        </button>
        <button
          onClick={() => handleSelectScenario('miss3')}
          className={`py-2 px-2 text-[12px] font-medium rounded-medium border transition-all ${
            scenario === 'miss3'
              ? 'bg-attendance-red/15 text-attendance-red border-attendance-red/30 font-semibold'
              : 'bg-surface-secondary border-border-card text-text-secondary hover:text-text-primary'
          }`}
        >
          +3 Miss
        </button>
        <button
          onClick={() => handleSelectScenario('custom')}
          className={`col-span-2 py-2 px-2 text-[12px] font-medium rounded-medium border transition-all ${
            scenario === 'custom'
              ? 'bg-brand-info/15 text-brand-info border-brand-info/30 font-semibold'
              : 'bg-surface-secondary border-border-card text-text-secondary hover:text-text-primary'
          }`}
        >
          Custom Stepper
        </button>
      </div>

      {/* Custom Stepper Controls */}
      {scenario === 'custom' && (
        <div className="p-3 bg-surface-secondary border border-border-card rounded-medium space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-text-secondary">Attend Classes:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCustomAttend((prev) => Math.max(0, prev - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-medium bg-surface border border-border-card text-text-primary hover:bg-border-card/20"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-[14px]">{customAttend}</span>
              <button
                onClick={() => setCustomAttend((prev) => prev + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-medium bg-surface border border-border-card text-text-primary hover:bg-border-card/20"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-text-secondary">Miss Classes:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCustomMiss((prev) => Math.max(0, prev - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-medium bg-surface border border-border-card text-text-primary hover:bg-border-card/20"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-[14px]">{customMiss}</span>
              <button
                onClick={() => setCustomMiss((prev) => prev + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-medium bg-surface border border-border-card text-text-primary hover:bg-border-card/20"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reality vs Simulation Comparison Result */}
      {result && (
        <div className="p-3 bg-surface-secondary border border-border-card rounded-medium flex items-center justify-between animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
              Simulated Outcome
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[20px] font-bold text-text-primary">
                {result.percentage}%
              </span>
              <span className="text-[12px] font-medium text-text-secondary">
                ({result.attendedClasses}/{result.totalClasses} classes)
              </span>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-pill border text-[11px] font-bold uppercase tracking-wider ${statusColorMap[result.status]}`}>
            {result.percentage >= realPercentage ? '+' : ''}{result.percentage - realPercentage}% ({result.statusLabel})
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceSimulatorCard
