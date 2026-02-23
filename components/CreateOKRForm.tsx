'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Profile { id: string; full_name: string; entity: string }

export default function CreateOKRForm({ profiles }: { profiles: Profile[] }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [quarter, setQuarter] = useState('Q1 2025')
  const [assignedTo, setAssignedTo] = useState('')
  const [keyResults, setKeyResults] = useState([''])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  function addKR() { setKeyResults([...keyResults, '']) }
  function updateKR(i: number, v: string) {
    const arr = [...keyResults]; arr[i] = v; setKeyResults(arr)
  }
  function removeKR(i: number) {
    setKeyResults(keyResults.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !assignedTo) return
    setSaving(true)

    await supabase.from('okrs').insert({
      title,
      description,
      quarter,
      assigned_to: assignedTo,
      key_results: keyResults.filter(kr => kr.trim()),
      is_active: true,
    })

    setSaving(false)
    setSuccess(true)
    setTitle(''); setDescription(''); setAssignedTo(''); setKeyResults([''])
    setTimeout(() => { setSuccess(false); window.location.reload() }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-surface-2 rounded-sm p-6 space-y-4">
      <div>
        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Objective Title *</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          placeholder="e.g. Grow revenue in Southeast Asia"
        />
      </div>

      <div>
        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink resize-none focus:outline-none focus:border-accent transition-colors"
          placeholder="Optional context..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted uppercase tracking-widest mb-2">Quarter *</label>
          <select
            value={quarter}
            onChange={e => setQuarter(e.target.value)}
            className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          >
            {['Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026'].map(q => (
              <option key={q}>{q}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-muted uppercase tracking-widest mb-2">Assign To *</label>
          <select
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            required
            className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Select employee</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.full_name} ({p.entity})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Results */}
      <div>
        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Key Results</label>
        <div className="space-y-2">
          {keyResults.map((kr, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={kr}
                onChange={e => updateKR(i, e.target.value)}
                className="flex-1 bg-surface border border-surface-2 rounded-sm px-4 py-2 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                placeholder={`KR${i + 1}: e.g. Achieve $1M ARR`}
              />
              {keyResults.length > 1 && (
                <button type="button" onClick={() => removeKR(i)} className="text-muted hover:text-accent px-2 transition-colors">×</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addKR} className="text-xs text-muted hover:text-accent underline underline-offset-2 transition-colors">
            + Add key result
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-ink text-paper py-3 rounded-sm text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
      >
        {saving ? 'Creating...' : success ? '✓ Created!' : 'Create OKR'}
      </button>
    </form>
  )
}
