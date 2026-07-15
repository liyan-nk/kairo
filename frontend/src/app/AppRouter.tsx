import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RootLayout from '../components/RootLayout'
import TodayPage from '../features/TodayPage'
import SubjectsPage from '../features/SubjectsPage'
import CampusPage from '../features/CampusPage'
import ProfilePage from '../features/ProfilePage'
import NotFound from '../features/NotFound'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<TodayPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/campus" element={<CampusPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
