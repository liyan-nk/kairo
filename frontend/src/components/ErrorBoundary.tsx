import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import EmptyState from './EmptyState'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
          <EmptyState
            icon={<AlertCircle className="text-brand-danger" />}
            title="Something went wrong"
            description="We encountered an unexpected error. Please refresh the page or try again."
            actionLabel="Refresh App"
            onAction={() => window.location.reload()}
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
