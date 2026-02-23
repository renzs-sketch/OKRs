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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant:ital,wght@0,300;0,400;1,300&family=Jost:wght@200;300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background-color: #1C1C1A;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle grain texture overlay */
        .login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* Geometric accent lines */
        .login-root::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #C4A882, transparent);
          z-index: 1;
        }

        .login-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 420px;
          animation: fadeUp 0.7s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Logos row */
        .logos-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 48px;
          opacity: 0.7;
        }

        .logo-divider {
          width: 1px;
          height: 28px;
          background: #444;
        }

        .logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 0.12em;
          color: #9E9E9E;
          line-height: 1.1;
        }

        .logo-text small {
          display: block;
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 7px;
          letter-spacing: 0.25em;
          color: #666;
          margin-top: 2px;
        }

        /* Chozen circle mark */
        .chozen-mark {
          width: 32px;
          height: 32px;
          border: 1.5px solid #666;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .chozen-mark::before {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          border: 1px solid #555;
          transform: rotate(45deg);
        }

        /* Main title */
        .brand-block {
          text-align: center;
          margin-bottom: 48px;
        }

        .brand-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 64px;
          letter-spacing: 0.08em;
          color: #F0EBE1;
          line-height: 0.9;
          display: block;
        }

        .brand-rule {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 14px 0 12px;
        }

        .brand-rule-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #444);
        }

        .brand-rule-line.right {
          background: linear-gradient(270deg, transparent, #444);
        }

        .brand-rule-diamond {
          width: 4px;
          height: 4px;
          background: #C4A882;
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        .brand-subtitle {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 9px;
          letter-spacing: 0.4em;
          color: #7A7468;
          text-transform: uppercase;
          display: block;
        }

        /* Form */
        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 9px;
          letter-spacing: 0.35em;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          background: #252520;
          border: 1px solid #333;
          padding: 14px 16px;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: #D4CFC7;
          outline: none;
          transition: border-color 0.2s;
          letter-spacing: 0.02em;
        }

        .form-input::placeholder {
          color: #444;
        }

        .form-input:focus {
          border-color: #C4A882;
        }

        .form-error {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: #C4714A;
          margin-top: 12px;
          padding: 10px 14px;
          border: 1px solid #3A2820;
          background: #1F1A18;
          letter-spacing: 0.02em;
        }

        .form-submit {
          width: 100%;
          margin-top: 24px;
          background: #F0EBE1;
          color: #1C1C1A;
          border: none;
          padding: 16px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .form-submit:hover:not(:disabled) {
          background: #C4A882;
        }

        .form-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-footer {
          text-align: center;
          margin-top: 28px;
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #444;
          text-transform: uppercase;
        }

        /* Bottom rule */
        .bottom-rule {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #333, transparent);
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">

          {/* Company logos */}
          <div className="logos-row">
            <div className="logo-text">
              PHX<span style={{fontFamily:'Jost',fontWeight:200,fontSize:'11px',letterSpacing:'0.05em'}}>✦</span>JAX
              <small>ARTS + INNOVATION DISTRICT</small>
            </div>
            <div className="logo-divider" />
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <div className="chozen-mark">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="5" y1="0" x2="5" y2="10" stroke="#666" strokeWidth="0.8"/>
                  <line x1="0" y1="5" x2="10" y2="5" stroke="#666" strokeWidth="0.8"/>
                </svg>
              </div>
              <div className="logo-text">
                CHOZEN
                <small>CENTER FOR REGENERATIVE LIVING</small>
              </div>
            </div>
            <div className="logo-divider" />
            <div className="logo-text" style={{color:'#7A82A8'}}>
              FUTURE
              <small style={{color:'#5A6080',letterSpacing:'0.3em'}}>OF CITIES</small>
            </div>
          </div>

          {/* Brand */}
          <div className="brand-block">
            <span className="brand-title">OKR PULSE</span>
            <div className="brand-rule">
              <div className="brand-rule-line" />
              <div className="brand-rule-diamond" />
              <div className="brand-rule-line right" />
            </div>
            <span className="brand-subtitle">Weekly Accountability · Simplified</span>
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

        <div className="bottom-rule" />
      </div>
    </>
  )
}
