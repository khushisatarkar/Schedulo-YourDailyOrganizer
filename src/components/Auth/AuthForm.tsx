import React, { useState, useRef } from 'react'
import { Mail, Lock, User, AlertCircle, Clock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const { signIn, signUp } = useAuth()
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null)

  const startCooldown = (seconds: number) => {
    setCooldownSeconds(seconds)
    
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current)
    }
    
    cooldownTimerRef.current = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) {
            clearInterval(cooldownTimerRef.current)
            cooldownTimerRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cooldownSeconds > 0) {
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password)

      if (error) {
        // Check for rate limit error
        if (error.message.includes('over_email_send_rate_limit') || 
            error.message.includes('rate limit') ||
            error.message.includes('too many requests')) {
          setError('Too many requests. Please wait before trying again.')
          startCooldown(15) // Start 15-second cooldown
        } else {
          setError(error.message)
        }
      }
    } catch (err: any) {
      // Handle network errors that might contain rate limit info
      if (err?.message?.includes('429') || 
          err?.message?.includes('rate limit') ||
          err?.message?.includes('over_email_send_rate_limit')) {
        setError('Too many requests. Please wait before trying again.')
        startCooldown(15)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  // Clean up timer on unmount
  React.useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current)
      }
    }
  }, [])

  const isDisabled = loading || cooldownSeconds > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isSignUp 
              ? 'Sign up to start managing your schedule' 
              : 'Sign in to your account to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
                disabled={isDisabled}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                required
                minLength={6}
                disabled={isDisabled}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {cooldownSeconds > 0 && (
            <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-lg">
              <Clock className="w-4 h-4" />
              Please wait {cooldownSeconds} seconds before trying again
            </div>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 
             cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s` :
             (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={isDisabled}
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}