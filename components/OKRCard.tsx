'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface OKRCardProps {
  okr: {
    id: string
    title: string
    description: string
    key_results: string[]
    quarter: string
  }
  existingUpdate: {
    id: string
    update_text: string
    progress_score: number
    submitted_at: string
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

export default function OKRCard({ okr, existingUpdate, weekStart, delay }: OKRCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [updateText, setUpdateText] = useState(existingUpdate?.update_text || '')
  const [score, setScore] = useState(existingUpdate?.progress_score || 3)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  const scoreColors: Record<number, string> = {
    1: 'bg-red-100 text-red-700 border-red-200',
    2: 'bg-orange-100 text-orange-700 border-orange-200',
    3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    4: 'bg-green-100 text-green-700 border-green-200',
    5: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }

  async function handleSubmit() {
    if (!updateText.trim()) return
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (existingUpdate) {
      await supabase
        .from('weekly_updates')
        .update({ update_text: updateText, progress_score: score, submitted_at: new Date().toISOString() })
        .eq('id', existingUpdate.id)
    } else {
      await supabase
        .from('weekly_updates')
        .insert({
          okr_id: okr.id,
          user_id: user!.id,
          week_start: weekStart,
          update_text: updateText,
          progress_score: score,
          submitted_at: new Date().toISOString(),
        })
    }

    setSaving(false)
    setSaved(true)
    setIsEditing(false)
    setTimeout(() => setSaved(false), 3000)
    // Refresh
    window.location.reload()
  }

  const hasUpdate = !!existingUpdate

  return (
    <div className={`animate-fadeUp delay-${Math.min(delay, 4)} bg-white border border-surface-2 rounded-sm overflow-hidden`}>
      {/* Card header */}
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

        {/* Key Results */}
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
      </div>

      {/* Existing update display */}
      {hasUpdate && !isEditing && (
        <div className="px-6 pb-5 border-t border-surface-2 pt-4">
          <p className="text-sm text-ink leading-relaxed">{existingUpdate.update_text}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-3 text-xs text-muted hover:text-accent underline underline-offset-2 transition-colors"
          >
            Edit update
          </button>
        </div>
      )}

      {/* Update form */}
      {(!hasUpdate || isEditing) && (
        <div className="px-6 pb-5 border-t border-surface-2 pt-4 space-y-4">
          <div>
            <label className="block text-xs text-muted uppercase tracking-widest mb-2">
              Progress Score
            </label>
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
            <label className="block text-xs text-muted uppercase tracking-widest mb-2">
              Weekly Update
            </label>
            <textarea
              value={updateText}
              onChange={e => setUpdateText(e.target.value)}
              rows={4}
              placeholder="What progress did you make this week? Any blockers? What's planned next week?"
              className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-3 text-sm text-ink resize-none focus:outline-none focus:border-accent transition-colors"
            />
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
