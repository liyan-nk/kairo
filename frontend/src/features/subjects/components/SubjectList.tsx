import React from 'react'
import SubjectCard from './SubjectCard'
import type { SubjectItemViewModel } from '../utils/subjectViewModel'

interface SubjectListProps {
  subjects: SubjectItemViewModel[]
}

export const SubjectList: React.FC<SubjectListProps> = ({ subjects }) => {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  )
}

export default SubjectList
