import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Typography from '../../components/Typography'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { useAuth } from '../../app/AuthContext'

export const SignupPage: React.FC = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }

    setIsSubmitting(true)
    try {
      await signup(name.trim(), email.trim(), password.trim())
      navigate('/', { replace: true })
    } catch {
      setError('Registration failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col items-center justify-center p-4 max-w-[480px] mx-auto border-x border-border-card select-none">
      <div className="w-full space-y-6 animate-in fade-in duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-large bg-brand-info/10 border border-brand-info/20 flex items-center justify-center text-brand-info mx-auto shadow-sm">
            <span className="text-xl font-bold font-sans tracking-wider">K</span>
          </div>
          <Typography variant="h2" weight="bold">
            Create Account
          </Typography>
          <Typography variant="caption" color="secondary" className="block text-[14px]">
            Get started with KAIRO
          </Typography>
        </div>

        {/* Form Card */}
        <Card variant="default" padding="lg" className="space-y-4">
          {error && (
            <div className="p-3 bg-brand-danger/10 border border-brand-danger/20 rounded-medium text-brand-danger text-[13px] font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full h-[44px] px-3 bg-surface border border-border-card rounded-medium text-text-primary text-[14px] focus:outline-none focus:border-brand-info font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full h-[44px] px-3 bg-surface border border-border-card rounded-medium text-text-primary text-[14px] focus:outline-none focus:border-brand-info font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[44px] px-3 bg-surface border border-border-card rounded-medium text-text-primary text-[14px] focus:outline-none focus:border-brand-info font-medium"
              />
            </div>

            <Button
              variant="primary"
              fullWidth
              disabled={isSubmitting}
              className="h-[44px] text-[14px] font-semibold mt-2"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-border-card/40">
            <Typography variant="caption" color="secondary" className="text-[13px]">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-info font-semibold hover:underline">
                Sign In
              </Link>
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SignupPage
