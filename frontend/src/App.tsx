import ErrorBoundary from './components/ErrorBoundary'
import AppProviders from './app/AppProviders'
import AppRouter from './app/AppRouter'
import './App.css'

export const App = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App
