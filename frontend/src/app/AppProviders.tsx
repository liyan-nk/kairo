import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './ToastProvider'

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <ToastProvider>{children}</ToastProvider>
    </BrowserRouter>
  )
}

export default AppProviders
