import { Link } from 'react-router-dom'
import Typography from '../../../components/Typography'
import { AttendanceBadge } from './AttendanceBadge'
import { AttendanceProgress } from './AttendanceProgress'
import type { SubjectItemViewModel } from '../utils/subjectViewModel'

interface SubjectCardProps {
  subject: SubjectItemViewModel
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  return (
    <Link
      to={`/subjects/${subject.id}`}
      className="p-5 bg-surface border border-border-card rounded-large space-y-4 shadow-sm select-none animate-in fade-in duration-200 block hover:border-text-secondary/30 transition-all cursor-pointer"
    >
      {/* Title & Info Block */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Typography variant="title" weight="semibold">
            {subject.name}
          </Typography>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-text-secondary text-[12px]">
            <span>{subject.code}</span>
            <span>•</span>
            <span>{subject.faculty}</span>
            <span>•</span>
            <span>{subject.room}</span>
          </div>
        </div>
        <AttendanceBadge status={subject.status} label={subject.statusLabel} />
      </div>

      {/* Percentage stats */}
      <div className="space-y-2">
        <div className="flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <Typography variant="h2" weight="bold">
              {subject.percentage}%
            </Typography>
            <span className="text-[12px] text-text-secondary font-medium">
              ({subject.attendedClasses}/{subject.totalClasses} classes)
            </span>
          </div>
          <span className="text-[12px] font-semibold text-text-secondary shrink-0">
            {subject.missCountText}
          </span>
        </div>
        <AttendanceProgress percentage={subject.percentage} status={subject.status} />
      </div>
    </Link>
  )
}

export default SubjectCard
