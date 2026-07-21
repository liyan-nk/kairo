import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './ToastProvider'
import { ThemeProvider } from './ThemeContext'
import { AuthProvider } from './AuthContext'

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default AppProviders
