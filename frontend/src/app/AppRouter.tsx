import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RootLayout from '../components/RootLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import LoginPage from '../features/auth/LoginPage'
import SignupPage from '../features/auth/SignupPage'
import TodayPage from '../features/today/TodayPage'
import SubjectsPage from '../features/subjects/SubjectsPage'
import SubjectDetailPage from '../features/subjects/SubjectDetailPage'
import CampusPage from '../features/CampusPage'
import ProfilePage from '../features/ProfilePage'
import AboutPage from '../features/profile/AboutPage'
import TimetablePage from '../features/timetable/TimetablePage'
import NotFound from '../features/NotFound'
import ComponentPlayground from '../dev/ComponentPlayground'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RootLayout />}>
          <Route path="/" element={<TodayPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
          <Route path="/campus" element={<CampusPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {import.meta.env.DEV && (
        <Route path="/dev/playground" element={<ComponentPlayground />} />
      )}
    </Routes>
  )
}

export default AppRouter
