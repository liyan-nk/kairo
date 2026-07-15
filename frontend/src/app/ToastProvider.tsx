import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import Toast from '../components/Toast'

interface ToastContextType {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  const showToast = useCallback((msg: string) => {
    // Clear any active timer to prevent premature dismissing
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }

    setMessage(msg)

    timerRef.current = window.setTimeout(() => {
      setMessage(null)
      timerRef.current = null
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && <Toast message={message} />}
    </ToastContext.Provider>
  )
}

export default ToastProvider
