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
        @import url('https://fonts.googleapis.com/css2?family=Birthstone&family=Roboto+Condensed:wght@700&family=DM+Sans:wght@300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: #EDE8E3;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
        }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
        }

        .login-card {
          display: flex;
          width: 100%;
          max-width: 920px;
          min-height: 560px;
          background: #F5F2ED;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 60px rgba(0,0,0,0.10);
          animation: fadeUp 0.6s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .left-panel {
          flex: 0 0 420px;
          padding: 48px 44px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand-mark {
          font-family: 'Roboto Condensed', sans-serif;
          font-weight: 700;
          font-size: 28px;
          letter-spacing: 0.15em;
          color: #2C2824;
          text-transform: uppercase;
        }

        .brand-mark span {
          color: #B8A898;
          margin-right: 4px;
        }

        .form-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 32px 0;
        }

        .form-title {
          font-family: 'Birthstone', cursive;
          font-weight: 400;
          font-size: 42px;
          color: #8C8279;
          line-height: 1.1;
          margin-bottom: 6px;
        }

        .form-tagline {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #C4BEB7;
          text-transform: uppercase;
          display: block;
          margin-bottom: 32px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 10px;
          letter-spacing: 0.25em;
          color: #A89E94;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          background: #EDE9E4;
          border: 1px solid #DDD8D2;
          padding: 12px 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: #2C2824;
          outline: none;
          transition: border-color 0.2s;
          border-radius: 4px;
        }

        .form-input::placeholder { color: #C4BEB7; }
        .form-input:focus { border-color: #9B8E82; }

        .form-error {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: #9B5A3C;
          margin-top: 12px;
          padding: 10px 14px;
          background: #F2EAE4;
          border: 1px solid #DDD0C4;
          border-radius: 4px;
        }

        .form-submit {
          width: 100%;
          margin-top: 20px;
          background: #2C2824;
          color: #F5F2ED;
          border: none;
          padding: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
          border-radius: 4px;
        }

        .form-submit:hover:not(:disabled) { background: #9B8E82; }
        .form-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .form-footer {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: #C4BEB7;
        }

        .right-panel {
          flex: 1;
          position: relative;
          overflow: hidden;
          min-height: 400px;
        }

        .right-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .right-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, #F5F2ED 0%, rgba(245,242,237,0.5) 40%, transparent 70%);
          z-index: 1;
          pointer-events: none;
        }

        .right-panel-caption {
          position: absolute;
          bottom: 24px;
          right: 24px;
          z-index: 2;
          text-align: right;
        }

        .right-panel-caption p {
          font-family: 'DM Sans', sans-serif;
          font-style: italic;
          font-weight: 300;
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.05em;
        }

        @media (max-width: 700px) {
          .right-panel { display: none; }
          .left-panel { flex: 1; }
          .login-card { max-width: 440px; }
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">

          <div className="left-panel">
            <div className="brand-mark">
              <span>·</span>Cho Ventures
            </div>

            <div className="form-section">
              <h1 className="form-title">Welcome back.</h1>
              <span className="form-tagline">Weekly accountability, simplified.</span>

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
            </div>

            <p className="form-footer">Access by invitation only</p>
          </div>

          <div className="right-panel">
            <img
              src="https://i.imgur.com/iXtxLFf.jpeg"
              alt="Nature"
            />
            <div className="right-panel-caption">
              <p>Your weekly pulse check.</p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
