'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Profile { id: string; full_name: string; entity: string }

interface KR {
  description: string
  target_value: string
}

interface Metric {
  name: string
  type: '$' | '%' | '#'
  goal: string
  calculated: boolean
  formula: string // e.g. "A - B" or "(A / B) * 100"
}

export default function CreateOKRForm({ profiles }: { profiles: Profile[] }) {
  const [okrId, setOkrId] = useState('')
  const [entity, setEntity] = useState('')
  const [title, setTitle] = useState('')
  const [quarter, setQuarter] = useState('Q1 2025')
  const [assignedTo, setAssignedTo] = useState('')
  const [keyResults, setKeyResults] = useState<KR[]>([{ description: '', target_value: '' }])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [showMetrics, setShowMetrics] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  // KR helpers
  function addKR() { setKeyResults([...keyResults, { description: '', target_value: '' }]) }
  function updateKR(i: number, field: keyof KR, v: string) {
    const arr = [...keyResults]; arr[i][field] = v; setKeyResults(arr)
  }
  function removeKR(i: number) {
    setKeyResults(keyResults.filter((_, idx) => idx !== i))
  }

  // Metric helpers
  function addMetric() {
    setMetrics([...metrics, { name: '', type: '#', goal: '', calculated: false, formula: '' }])
  }
  function updateMetric(i: number, field: keyof Metric, v: any) {
    const arr = [...metrics]; arr[i] = { ...arr[i], [field]: v }; setMetrics(arr)
  }
  function removeMetric(i: number) {
    setMetrics(metrics.filter((_, idx) => idx !== i))
  }

  // Get manual metric names for formula reference
  const manualMetrics = metrics.filter(m => !m.calculated && m.name.trim())

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
      metrics: metrics.filter(m => m.name.trim()),
      is_active: true,
    })

    setSaving(false)
    setSuccess(true)
    setOkrId(''); setEntity(''); setTitle(''); setAssignedTo('')
    setKeyResults([{ description: '', target_value: '' }])
    setMetrics([])
    setShowMetrics(false)
    setTimeout(() => { setSuccess(false); window.location.reload() }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-surface-2 rounded-sm p-6 space-y-4">

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted uppercase tracking-widest mb-2">OKR ID *</label>
          <input value={okrId} onChange={e => setOkrId(e.target.value)} required
            className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
            placeholder="e.g. OKR-001" />
        </div>
        <div>
          <label className="block text-xs text-muted uppercase tracking-widest mb-2">Entity *</label>
          <input value={entity} onChange={e => setEntity(e.target.value)} required
            className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
            placeholder="e.g. Leasing" />
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Objective *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required
          className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
          placeholder="e.g. Grow leasing revenue to $58,500/mo" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted uppercase tracking-widest mb-2">Quarter *</label>
          <select value={quarter} onChange={e => setQuarter(e.target.value)}
            className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors">
            {['Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026'].map(q => (
              <option key={q}>{q}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted uppercase tracking-widest mb-2">DRI *</label>
          <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} required
            className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors">
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
                <input value={kr.description} onChange={e => updateKR(i, 'description', e.target.value)}
                  className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                  placeholder={`KR${i + 1}: e.g. Achieve $58,500 monthly rent`} />
                <input value={kr.target_value} onChange={e => updateKR(i, 'target_value', e.target.value)}
                  className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                  placeholder="Target value (optional, e.g. $58,500 or 95%)" />
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

      {/* Quantitative Metrics */}
      <div className="border-t border-surface-2 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="block text-xs text-muted uppercase tracking-widest">Quantitative Metrics</label>
            <p className="text-xs text-muted mt-0.5">Optional — add numerical targets employees report on weekly</p>
          </div>
          <button type="button" onClick={() => { setShowMetrics(!showMetrics); if (!showMetrics && metrics.length === 0) addMetric() }}
            className="text-xs text-muted hover:text-accent border border-surface-2 px-3 py-1.5 rounded-sm transition-colors">
            {showMetrics ? 'Hide' : '+ Add Metrics'}
          </button>
        </div>

        {showMetrics && (
          <div className="space-y-3">
            {metrics.map((m, i) => (
              <div key={i} className={`p-3 rounded-sm border ${m.calculated ? 'bg-surface border-surface-2' : 'bg-surface border-surface-2'}`}>
                <div className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">

                    {/* Metric name + type + calculated toggle */}
                    <div className="flex gap-2 items-center">
                      <input value={m.name} onChange={e => updateMetric(i, 'name', e.target.value)}
                        className="flex-1 bg-white border border-surface-2 rounded-sm px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                        placeholder={`Metric name (e.g. Monthly Rent)`} />
                      <select value={m.type} onChange={e => updateMetric(i, 'type', e.target.value)}
                        className="bg-white border border-surface-2 rounded-sm px-2 py-1.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors w-16">
                        <option value="#">#</option>
                        <option value="$">$</option>
                        <option value="%">%</option>
                      </select>
                      <label className="flex items-center gap-1.5 text-xs text-muted whitespace-nowrap cursor-pointer">
                        <input type="checkbox" checked={m.calculated} onChange={e => updateMetric(i, 'calculated', e.target.checked)}
                          className="accent-accent" />
                        Auto-calc
                      </label>
                    </div>

                    {/* Goal (only for manual metrics) */}
                    {!m.calculated && (
                      <input value={m.goal} onChange={e => updateMetric(i, 'goal', e.target.value)}
                        className="w-full bg-white border border-surface-2 rounded-sm px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                        placeholder={`Goal value (e.g. ${m.type === '$' ? '58500' : m.type === '%' ? '95' : '10'})`} />
                    )}

                    {/* Formula (only for calculated metrics) */}
                    {m.calculated && (
                      <div>
                        <input value={m.formula} onChange={e => updateMetric(i, 'formula', e.target.value)}
                          className="w-full bg-white border border-surface-2 rounded-sm px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                          placeholder={`Formula using metric names, e.g. "Monthly Rent Goal - Current Monthly Rent"`} />
                        {manualMetrics.length > 0 && (
                          <p className="text-xs text-muted mt-1">
                            Available: {manualMetrics.map(mm => `"${mm.name}"`).join(', ')}
                          </p>
                        )}
                        <p className="text-xs text-muted mt-0.5">Supported: A - B, A + B, (A / B) * 100</p>
                      </div>
                    )}
                  </div>

                  <button type="button" onClick={() => removeMetric(i)} className="text-muted hover:text-accent px-1 pt-1 transition-colors text-lg leading-none">×</button>
                </div>
              </div>
            ))}

            <button type="button" onClick={addMetric}
              className="text-xs text-muted hover:text-accent underline underline-offset-2 transition-colors">
              + Add another metric
            </button>
          </div>
        )}
      </div>

      <button type="submit" disabled={saving}
        className="w-full bg-ink text-paper py-3 rounded-sm text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50">
        {saving ? 'Creating...' : success ? '✓ Created!' : 'Create OKR'}
      </button>
    </form>
  )
}
```

Go to:
```
https://github.com/renzs-sketch/OKRs/edit/main/components/CreateOKRForm.tsx
