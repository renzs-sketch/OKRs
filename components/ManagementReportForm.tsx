'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  weekStart: string
  existingReport?: {
    id: string
    report_text: string
    attachment_url: string
  } | null
}

export default function ManagementReportForm({ userId, weekStart, existingReport }: Props) {
  const [reportText, setReportText] = useState(existingReport?.report_text || '')
  const [attachmentUrl, setAttachmentUrl] = useState(existingReport?.attachment_url || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      user_id: userId,
      week_start: weekStart,
      report_text: reportText,
      attachment_url: attachmentUrl || null,
      submitted_at: new Date().toISOString(),
    }

    if (existingReport?.id) {
      await supabase.from('management_reports').update(payload).eq('id', existingReport.id)
    } else {
      await supabase.from('management_reports').insert(payload)
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-surface-2 rounded-sm p-6 max-w-2xl">
      <div className="mb-5">
        <label className="block text-xs font-medium text-muted uppercase tracking-widest mb-2">
          Weekly Report
        </label>
        <textarea
          value={reportText}
          onChange={e => setReportText(e.target.value)}
          rows={6}
          placeholder="Share your updates, highlights, and concerns for this week..."
          className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-3 text-sm text-ink placeholder:text-muted resize-none focus:outline-none focus:border-ink transition-colors"
        />
      </div>

      <div className="mb-6">
        <label className="block text-xs font-medium text-muted uppercase tracking-widest mb-2">
          Attachment URL <span className="normal-case text-muted">(optional)</span>
        </label>
        <input
          type="url"
          value={attachmentUrl}
          onChange={e => setAttachmentUrl(e.target.value)}
          placeholder="https://docs.google.com/..."
          className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={saving || !reportText.trim()}
        className="bg-ink text-paper px-6 py-2.5 rounded-sm text-xs font-medium uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : saved ? '✓ Saved!' : existingReport ? 'Update Report' : 'Submit Report'}
      </button>
    </form>
  )
}
