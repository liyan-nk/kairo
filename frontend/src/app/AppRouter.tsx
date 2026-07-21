import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RootLayout from '../components/RootLayout'
import TodayPage from '../features/today/TodayPage'
import SubjectsPage from '../features/subjects/SubjectsPage'
import SubjectDetailPage from '../features/subjects/SubjectDetailPage'
import CampusPage from '../features/CampusPage'
import ProfilePage from '../features/ProfilePage'
import TimetablePage from '../features/timetable/TimetablePage'
import NotFound from '../features/NotFound'
import ComponentPlayground from '../dev/ComponentPlayground'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<TodayPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
        <Route path="/campus" element={<CampusPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      
      {import.meta.env.DEV && (
        <Route path="/dev/playground" element={<ComponentPlayground />} />
      )}
    </Routes>
  )
}

export default AppRouter
