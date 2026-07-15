import React from 'react'

interface ToastProps {
  message: string
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 max-w-[90vw] w-max bg-text-primary text-bg px-4 py-3 rounded-medium shadow-lg flex items-center justify-center font-medium text-[14px] leading-none select-none pointer-events-none z-50 animate-in fade-in slide-in-from-top-4 duration-200"
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
    </div>
  )
}

export default Toast
