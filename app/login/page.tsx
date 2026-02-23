'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fadeUp">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-sm mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">OKR Pulse</h1>
          <p className="text-muted text-sm mt-2">Weekly accountability, simplified</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-3 text-ink text-sm focus:outline-none focus:border-accent transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-3 text-ink text-sm focus:outline-none focus:border-accent transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-accent text-sm bg-red-50 border border-red-100 rounded-sm px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-3 rounded-sm text-sm font-medium tracking-wide hover:bg-accent transition-colors duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-xs text-muted mt-8">
          Access is by invitation only. Contact your administrator.
        </p>
      </div>
    </div>
  )
}
