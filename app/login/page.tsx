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
    window.location.href = email === 'renz@cho.ventures' ? '/admin' : '/employee'
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background-color: #F3F1EE;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          animation: fadeUp 0.6s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* CHO VENTURES logo block */
        .brand-logo {
          text-align: center;
          margin-bottom: 40px;
        }

        .brand-logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          font-size: 22px;
          letter-spacing: 0.22em;
          color: #2C2A27;
          text-transform: uppercase;
          display: block;
        }

        .brand-logo-rule {
          width: 32px;
          height: 1px;
          background: #9B9B7C;
          margin: 8px auto 0;
        }

        /* Title block */
        .title-block {
          text-align: center;
          margin-bottom: 40px;
        }

        .title-main {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 42px;
          letter-spacing: 0.15em;
          color: #2C2A27;
          text-transform: uppercase;
          display: block;
          line-height: 1;
        }

        .title-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 9px;
          letter-spacing: 0.35em;
          color: #9B9B7C;
          text-transform: uppercase;
          display: block;
          margin-top: 10px;
        }

        /* Form */
        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 9px;
          letter-spacing: 0.3em;
          color: #9B9B7C;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          background: #EDEAE6;
          border: 1px solid #DEDAD5;
          padding: 13px 16px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: #2C2A27;
          outline: none;
          transition: border-color 0.2s;
          border-radius: 0;
          -webkit-appearance: none;
        }

        .form-input::placeholder {
          color: #C0BBB4;
        }

        .form-input:focus {
          border-color: #74685D;
        }

        .form-error {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: #8B5E3C;
          margin-top: 12px;
          padding: 10px 14px;
          background: #F0EAE3;
          border: 1px solid #DDD0C4;
        }

        .form-submit {
          width: 100%;
          margin-top: 24px;
          background: #2C2A27;
          color: #F3F1EE;
          border: none;
          padding: 15px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
          border-radius: 0;
        }

        .form-submit:hover:not(:disabled) {
          background: #74685D;
        }

        .form-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-footer {
          text-align: center;
          margin-top: 24px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #B0AB9E;
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">

          {/* CHO VENTURES Logo */}
          <div className="brand-logo">
            <span className="brand-logo-name">Cho Ventures</span>
            <div className="brand-logo-rule" />
          </div>

          {/* Title */}
          <div className="title-block">
            <span className="title-main">OKR PULSE</span>
            <span className="title-sub">Weekly Management Report</span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="you@company.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" disabled={loading} className="form-submit">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="form-footer">Access by invitation only</p>
        </div>
      </div>
    </>
  )
}
