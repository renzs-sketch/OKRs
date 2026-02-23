'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Profile { id: string; full_name: string; entity: string }

interface KR {
  description: string
  target_value: string
}

export default function CreateOKRForm({ profiles }: { profiles: Profile[] }) {
  const [okrId, setOkrId] = useState('')
  const [entity, setEntity] = useState('')
  const [title, setTitle] = useState('')
  const [quarter, setQuarter] = useState('Q1 2025')
  const [assignedTo, setAssignedTo] = useState('')
  const [keyResults, setKeyResults] = useState<KR[]>([{ description: '', target_value: '' }])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  function addKR() { setKeyResults([...keyResults, { description: '', target_value: '' }]) }
  function updateKR(i: number, field: keyof KR, v: string) {
    const arr = [...keyResults]; arr[i][field] = v; setKeyResults(arr)
  }
  function removeKR(i: number) {
    setKeyResults(keyResults.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !assignedTo) return
    setSaving(true)

    const krStrings = keyResults
      .filter(kr => kr.description.trim())
      .map(kr => kr.target_value ? `${kr.description} (Target: ${kr.target_value})` : kr.description)

    await supabase.from('okrs').insert({
      okr_id: okrId,
      entity,
      title,
      quarter,
      assigned_to: assignedTo,
      key_results: krStrings,
      is_active: true,
    })

    setSaving(false)
    setSuccess(true)
    setOkrId(''); setEntity(''); setTitle(''); setAssignedTo('')
    setKeyResults([{ description: '', target_value: '' }])
    setTimeout(() => { setSuccess(false); window.location.reload() }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-surface-2 rounded-sm p-6 space-y-4">
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted uppercase tracking-widest mb-2">OKR ID *</label>
          <input
            value={okrId}
            onChange={e => setOkrId(e.target.value)}
            required
            className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
            placeholder="e.g. OKR-001"
          />
        </div>
        <div>
          <label className="block text-xs text-muted uppercase tracking-widest mb-2">Entity *</label>
          <input
            value={entity}
            onChange={e => setEntity(e.target.value)}
            required
            className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
            placeholder="e.g. Sales PH"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Objective *</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          placeholder="e.g. Grow revenue in Southeast Asia"
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
          <label className="block text-xs text-muted uppercase tracking-widest mb-2">DRI *</label>
          <select
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            required
            className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Select DRI</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.full_name} ({p.entity})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Results */}
      <div>
        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Key Results</label>
        <div className="space-y-3">
          {keyResults.map((kr, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <input
                  value={kr.description}
                  onChange={e => updateKR(i, 'description', e.target.value)}
                  className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                  placeholder={`KR${i + 1}: e.g. Achieve $1M ARR`}
                />
                <input
                  value={kr.target_value}
                  onChange={e => updateKR(i, 'target_value', e.target.value)}
                  className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                  placeholder="KR Target Value (optional, e.g. $1M, 95%, 100 units)"
                />
              </div>
              {keyResults.length > 1 && (
                <button type="button" onClick={() => removeKR(i)} className="text-muted hover:text-accent px-2 pt-2 transition-colors">×</button>
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
