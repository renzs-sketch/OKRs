'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Metric {
  name: string
  type: '$' | '%' | '#'
  goal: string
  calculated: boolean
  formula: string
}

interface OKRCardProps {
  okr: {
    id: string
    title: string
    description: string
    key_results: string[]
    quarter: string
    metrics?: Metric[]
  }
  existingUpdate: {
    id: string
    update_text: string
    progress_score: number
    submitted_at: string
    metric_values?: Record<string, string>
    needs_support?: boolean
    support_details?: string
  } | null
  weekStart: string
  delay: number
}

const SCORES = [
  { value: 1, label: '1', desc: 'Off track' },
  { value: 2, label: '2', desc: 'At risk' },
  { value: 3, label: '3', desc: 'On track' },
  { value: 4, label: '4', desc: 'Ahead' },
  { value: 5, label: '5', desc: 'Exceeded' },
]

const scoreColors: Record<number, string> = {
  1: 'bg-red-100 text-red-700 border-red-200',
  2: 'bg-orange-100 text-orange-700 border-orange-200',
  3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  4: 'bg-green-100 text-green-700 border-green-200',
  5: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

function formatValue(val: string, type: string) {
  if (!val) return '—'
  if (type === '$') return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  if (type === '%') return `${val}%`
  return val
}

function computeFormula(formula: string, values: Record<string, string>): string {
  try {
    let expr = formula
    Object.entries(values).forEach(([name, val]) => {
      expr = expr.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), val || '0')
    })
    if (!/^[\d\s\+\-\*\/\(\)\.]+$/.test(expr)) return '—'
    const result = Function('"use strict"; return (' + expr + ')')()
    return isFinite(result) ? Number(result).toFixed(2) : '—'
  } catch {
    return '—'
  }
}

export default function OKRCard({ okr, existingUpdate, weekStart, delay }: OKRCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [updateText, setUpdateText] = useState(existingUpdate?.update_text || '')
  const [score, setScore] = useState(existingUpdate?.progress_score || 3)
  const [metricValues, setMetricValues] = useState<Record<string, string>>(
    existingUpdate?.metric_values || {}
  )
  const [needsSupport, setNeedsSupport] = useState(existingUpdate?.needs_support || false)
  const [supportDetails, setSupportDetails] = useState(existingUpdate?.support_details || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  const metrics = okr.metrics || []
  const manualMetrics = metrics.filter(m => !m.calculated)
  const calculatedMetrics = metrics.filter(m => m.calculated)

  async function handleSubmit() {
    if (!updateText.trim()) return
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()

    const finalMetricValues = { ...metricValues }
    calculatedMetrics.forEach(m => {
      finalMetricValues[m.name] = computeFormula(m.formula, metricValues)
    })

    const payload = {
      update_text: updateText,
      progress_score: score,
      metric_values: finalMetricValues,
      needs_support: needsSupport,
      support_details: needsSupport ? supportDetails : null,
      submitted_at: new Date().toISOString()
    }

    if (existingUpdate) {
      await supabase.from('weekly_updates').update(payload).eq('id', existingUpdate.id)
    } else {
      await supabase.from('weekly_updates').insert({
        okr_id: okr.id,
        user_id: user!.id,
        week_start: weekStart,
        ...payload,
      })
    }

    setSaving(false)
    setSaved(true)
    setIsEditing(false)
    setTimeout(() => setSaved(false), 3000)
    window.location.reload()
  }

  const hasUpdate = !!existingUpdate

  return (
    <div className={`animate-fadeUp delay-${Math.min(delay, 4)} bg-white border border-surface-2 rounded-sm overflow-hidden`}>
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted uppercase tracking-widest">{okr.quarter}</span>
              {hasUpdate && !isEditing && (
                <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                  ✓ Submitted
                </span>
              )}
              {hasUpdate && !isEditing && existingUpdate.needs_support && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                  ⚑ Needs Support
                </span>
              )}
            </div>
            <h3 className="font-display font-semibold text-lg text-ink leading-snug">{okr.title}</h3>
            {okr.description && (
              <p className="text-sm text-muted mt-1">{okr.description}</p>
            )}
          </div>
          {hasUpdate && !isEditing && (
            <div className={`shrink-0 px-3 py-1 rounded-sm border text-sm font-semibold ${scoreColors[existingUpdate.progress_score]}`}>
              {existingUpdate.progress_score}/5
            </div>
          )}
        </div>

        {okr.key_results?.length > 0 && (
          <div className="mt-3 space-y-1">
            {okr.key_results.map((kr, i) => (
              <div key={i} className="flex gap-2 text-xs text-muted">
                <span className="text-accent font-bold shrink-0">KR{i + 1}</span>
                <span>{kr}</span>
              </div>
            ))}
          </div>
        )}

        {hasUpdate && !isEditing && metrics.length > 0 && existingUpdate.metric_values && (
          <div className="mt-4 pt-4 border-t border-surface-2">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">Metrics This Week</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {metrics.map(m => {
                const val = existingUpdate.metric_values?.[m.name] || '—'
                return (
                  <div key={m.name} className="bg-surface rounded-sm px-3 py-2">
                    <p className="text-xs text-muted truncate">{m.name}</p>
                    <p className="text-sm font-semibold text-ink mt-0.5">
                      {m.calculated ? val : formatValue(val, m.type)}
                      {m.goal && !m.calculated && (
                        <span className="text-xs text-muted font-normal ml-1">
                          / {formatValue(m.goal, m.type)}
                        </span>
                      )}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {hasUpdate && !isEditing && (
        <div className="px-6 pb-5 border-t border-surface-2 pt-4">
          <p className="text-sm text-ink leading-relaxed">{existingUpdate.update_text}</p>
          {existingUpdate.needs_support && existingUpdate.support_details && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-sm">
              <p className="text-xs text-red-600 font-medium uppercase tracking-widest mb-1">Support Needed</p>
              <p className="text-sm text-red-700">{existingUpdate.support_details}</p>
            </div>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-3 text-xs text-muted hover:text-accent underline underline-offset-2 transition-colors"
          >
            Edit update
          </button>
        </div>
      )}

      {(!hasUpdate || isEditing) && (
        <div className="px-6 pb-5 border-t border-surface-2 pt-4 space-y-4">

          {metrics.length > 0 && (
            <div>
              <label className="block text-xs text-muted uppercase tracking-widest mb-3">Weekly Metrics</label>
              <div className="space-y-2">
                {manualMetrics.map(m => (
                  <div key={m.name} className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-muted mb-1">{m.name}</label>
                      <div className="flex items-center gap-1">
                        {m.type === '$' && <span className="text-sm text-muted">$</span>}
                        {m.goal ? (
                          <div className="flex-1 border border-surface-2 rounded-sm px-3 py-2 text-sm text-muted bg-surface-2 cursor-not-allowed">
                            {formatValue(m.goal, m.type)}
                          </div>
                        ) : (
                          <input
                            type="number"
                            value={metricValues[m.name] || ''}
                            onChange={e => setMetricValues({ ...metricValues, [m.name]: e.target.value })}
                            className="flex-1 bg-surface border border-surface-2 rounded-sm px-3 py-2 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                            placeholder={`Enter current ${m.type === '%' ? 'percentage' : m.type === '$' ? 'amount' : 'value'}`}
                          />
                        )}
                        {m.type === '%' && <span className="text-sm text-muted">%</span>}
                      </div>
                      {m.goal && <p className="text-xs text-muted mt-0.5">Goal — set by admin</p>}
                    </div>
                  </div>
                ))}

                {calculatedMetrics.length > 0 && (
                  <div className="pt-2 border-t border-surface-2">
                    <p className="text-xs text-muted mb-2">Auto-calculated:</p>
                    {calculatedMetrics.map(m => (
                      <div key={m.name} className="flex justify-between items-center py-1">
                        <span className="text-xs text-muted">{m.name}</span>
                        <span className="text-sm font-semibold text-ink">
                          {computeFormula(m.formula, metricValues)}{m.type === '%' ? '%' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-muted uppercase tracking-widest mb-2">Progress Score</label>
            <div className="flex gap-2">
              {SCORES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setScore(s.value)}
                  title={s.desc}
                  className={`flex-1 py-2 rounded-sm text-sm font-semibold border transition-all ${
                    score === s.value
                      ? scoreColors[s.value] + ' shadow-sm'
                      : 'border-surface-2 text-muted hover:border-muted'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mt-1">{SCORES.find(s => s.value === score)?.desc}</p>
          </div>

          <div>
            <label className="block text-xs text-muted uppercase tracking-widest mb-2">Weekly Update</label>
            <textarea
              value={updateText}
              onChange={e => setUpdateText(e.target.value)}
              rows={4}
              placeholder="What progress did you make this week? Any blockers? What's planned next week?"
              className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-3 text-sm text-ink resize-none focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Support Toggle */}
          <div className="border-t border-surface-2 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={needsSupport}
                onChange={e => {
                  setNeedsSupport(e.target.checked)
                  if (!e.target.checked) setSupportDetails('')
                }}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-sm text-ink">I need support from Tony on this OKR</span>
            </label>
            {needsSupport && (
              <textarea
                value={supportDetails}
                onChange={e => setSupportDetails(e.target.value)}
                rows={3}
                placeholder="Describe what help you need from Tony..."
                className="mt-3 w-full bg-red-50 border border-red-200 rounded-sm px-4 py-3 text-sm text-ink resize-none focus:outline-none focus:border-red-400 transition-colors"
              />
            )}
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={handleSubmit}
              disabled={saving || !updateText.trim()}
              className="bg-ink text-paper px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEditing ? 'Update' : 'Submit Update'}
            </button>
            {isEditing && (
              <button
                onClick={() => { setIsEditing(false); setUpdateText(existingUpdate?.update_text || '') }}
                className="text-sm text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
            )}
            {saved && <span className="text-xs text-success">✓ Saved!</span>}
          </div>
        </div>
      )}
    </div>
  )
}
