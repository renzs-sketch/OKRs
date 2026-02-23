'use client'
import { useState } from 'react'

export default function AddEmployeeForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [entity, setEntity] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, entity, password }),
    })
    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setResult({ ok: true, msg: `${name} added successfully!` })
      setName(''); setEmail(''); setEntity(''); setPassword('')
    } else {
      setResult({ ok: false, msg: data.error || 'Something went wrong.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-surface-2 rounded-sm p-6 space-y-4">
      <div>
        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Full Name *</label>
        <input value={name} onChange={e => setName(e.target.value)} required
          className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          placeholder="Maria Santos" />
      </div>
      <div>
        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Email *</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
          className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          placeholder="maria@company.com" />
      </div>
      <div>
        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Entity / Department *</label>
        <input value={entity} onChange={e => setEntity(e.target.value)} required
          className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          placeholder="e.g. Sales PH, Operations, Finance" />
      </div>
      <div>
        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Temporary Password *</label>
        <input type="text" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
          className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          placeholder="They can change this later" />
      </div>

      {result && (
        <p className={`text-sm px-3 py-2 rounded-sm ${result.ok ? 'bg-green-50 text-success border border-green-100' : 'bg-red-50 text-accent border border-red-100'}`}>
          {result.msg}
        </p>
      )}

      <button type="submit" disabled={loading}
        className="w-full bg-ink text-paper py-3 rounded-sm text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50">
        {loading ? 'Adding...' : 'Add Employee'}
      </button>

      <p className="text-xs text-muted">This creates their login account. Share the email and password with them directly.</p>
    </form>
  )
}
