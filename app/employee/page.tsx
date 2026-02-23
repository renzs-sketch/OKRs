'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentWeek } from '@/lib/utils'
import OKRCard from '@/components/OKRCard'

export default function EmployeePage() {
  const [okrs, setOkrs] = useState<any[]>([])
  const [updates, setUpdates] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [reportText, setReportText] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [existingReport, setExistingReport] = useState<any>(null)
  const [reportSaving, setReportSaving] = useState(false)
  const [reportSaved, setReportSaved] = useState(false)
  const [isEditingReport, setIsEditingReport] = useState(false)
  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: okrData } = await supabase
        .from('okrs')
        .select('*')
        .eq('assigned_to', user.id)
        .eq('is_active', true)
        .order('created_at')

      setOkrs(okrData || [])

      if (okrData && okrData.length > 0) {
        const ids = okrData.map(o => o.id)
        const { data: updateData } = await supabase
          .from('weekly_updates')
          .select('*')
          .in('okr_id', ids)
          .gte('week_start', weekStart)
          .lte('week_start', weekEnd)

        const map = (updateData || []).reduce((acc, u) => {
          acc[u.okr_id] = u
          return acc
        }, {} as Record<string, any>)
        setUpdates(map)
      }

      // Load existing management report
      const { data: reportData } = await supabase
        .from('management_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)
        .single()

      if (reportData) {
        setExistingReport(reportData)
        setReportText(reportData.report_text || '')
        setAttachmentUrl(reportData.attachment_url || '')
      }

      setLoading(false)
    }
    load()
  }, [])

  async function handleReportSubmit() {
    setReportSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (existingReport) {
      await supabase
        .from('management_reports')
        .update({ report_text: reportText, attachment_url: attachmentUrl, submitted_at: new Date().toISOString() })
        .eq('id', existingReport.id)
    } else {
      await supabase
        .from('management_reports')
        .insert({ user_id: user.id, week_start: weekStart, report_text: reportText, attachment_url: attachmentUrl })
    }

    setReportSaving(false)
    setReportSaved(true)
    setIsEditingReport(false)
    setTimeout(() => setReportSaved(false), 3000)
  }

  const submittedCount = Object.keys(updates).length
  const totalCount = okrs.length
  const allSubmitted = submittedCount === totalCount && totalCount > 0

  if (loading) return <div className="text-center py-20 text-muted">Loading...</div>

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">Your OKRs</h1>
        <p className="text-muted mt-2 text-sm">Submit your weekly update for each objective below.</p>
      </div>

      <div className="mb-8 animate-fadeUp delay-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted">Weekly submission progress</span>
          <span className="text-xs font-medium text-ink">{submittedCount}/{totalCount} submitted</span>
        </div>
        <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-700"
            style={{ width: totalCount ? `${(submittedCount / totalCount) * 100}%` : '0%' }}
          />
        </div>
        {allSubmitted && (
          <p className="text-success text-xs mt-2 font-medium">✓ All updates submitted for this week</p>
        )}
      </div>

      <div className="space-y-4">
        {okrs.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p className="font-display text-xl">No OKRs assigned yet.</p>
            <p className="text-sm mt-2">Your admin will assign objectives soon.</p>
          </div>
        )}
        {okrs.map((okr, i) => (
          <OKRCard
            key={okr.id}
            okr={okr}
            existingUpdate={updates[okr.id] || null}
            weekStart={weekStart}
            delay={i + 2}
          />
        ))}
      </div>

      {/* Management Report Card */}
      <div className="mt-8 bg-white border border-surface-2 rounded-sm overflow-hidden animate-fadeUp">
        <div className="px-6 pt-5 pb-4 border-b border-surface-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-lg text-ink">Weekly Management Report</h3>
              <p className="text-xs text-muted mt-1">Optional — share anything with leadership not tied to your OKRs</p>
            </div>
            {existingReport && !isEditingReport && (
              <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">✓ Submitted</span>
            )}
          </div>
        </div>

        {existingReport && !isEditingReport ? (
          <div className="px-6 py-5">
            {existingReport.report_text && (
              <p className="text-sm text-ink leading-relaxed mb-3">{existingReport.report_text}</p>
            )}
            {existingReport.attachment_url && (
              <a href={existingReport.attachment_url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-accent underline underline-offset-2">
                📎 {existingReport.attachment_url}
              </a>
            )}
            <button onClick={() => setIsEditingReport(true)}
              className="mt-3 block text-xs text-muted hover:text-accent underline underline-offset-2 transition-colors">
              Edit report
            </button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs text-muted uppercase tracking-widest mb-2">Report / Notes</label>
              <textarea
                value={reportText}
                onChange={e => setReportText(e.target.value)}
                rows={5}
                placeholder="Share any highlights, blockers, wins, or anything you want leadership to know this week..."
                className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-3 text-sm text-ink resize-none focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted uppercase tracking-widest mb-2">Attachment Link (optional)</label>
              <input
                value={attachmentUrl}
                onChange={e => setAttachmentUrl(e.target.value)}
                placeholder="Paste a Google Doc, Notion, Drive link, etc."
                className="w-full bg-surface border border-surface-2 rounded-sm px-4 py-3 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={handleReportSubmit}
                disabled={reportSaving || (!reportText.trim() && !attachmentUrl.trim())}
                className="bg-ink text-paper px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
              >
                {reportSaving ? 'Saving...' : isEditingReport ? 'Update Report' : 'Submit Report'}
              </button>
              {isEditingReport && (
                <button onClick={() => setIsEditingReport(false)}
                  className="text-sm text-muted hover:text-ink transition-colors">
                  Cancel
                </button>
              )}
              {reportSaved && <span className="text-xs text-success">✓ Saved!</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
