import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Inline placeholders for atomic commit scoping
const TodayPagePlaceholder = () => <div>Today Page</div>
const SubjectsPagePlaceholder = () => <div>Subjects Page</div>
const CampusPagePlaceholder = () => <div>Campus Page</div>
const ProfilePagePlaceholder = () => <div>Profile Page</div>
const NotFoundPlaceholder = () => <div>Not Found Page</div>

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TodayPagePlaceholder />} />
      <Route path="/subjects" element={<SubjectsPagePlaceholder />} />
      <Route path="/campus" element={<CampusPagePlaceholder />} />
      <Route path="/profile" element={<ProfilePagePlaceholder />} />
      <Route path="*" element={<NotFoundPlaceholder />} />
    </Routes>
  )
}

export default AppRouter
