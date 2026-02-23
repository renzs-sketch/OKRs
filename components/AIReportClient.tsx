'use client'
import { useState } from 'react'

interface Update {
  id: string
  update_text: string
  progress_score: number
  submitted_at: string
  okrs: {
    title: string
    description: string
    key_results: string[]
    quarter: string
    profiles: { full_name: string; entity: string }
  }
}

interface MissingOkr {
  id: string
  title: string
  profiles: { full_name: string; entity: string }
}

interface Props {
  updates: Update[]
  missingOkrs: MissingOkr[]
  weekLabel: string
}

export default function AIReportClient({ updates, missingOkrs, weekLabel }: Props) {
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)

  async function generateReport() {
    setLoading(true)
    setReport('')

    // Build prompt context
    const updatesSummary = updates.map(u => `
Employee: ${u.okrs?.profiles?.full_name} (${u.okrs?.profiles?.entity})
OKR: ${u.okrs?.title}
Quarter: ${u.okrs?.quarter}
Progress Score: ${u.progress_score}/5
Update: ${u.update_text}
    `).join('\n---\n')

    const missingSummary = missingOkrs.length > 0
      ? '\n\nMISSING SUBMISSIONS (no update submitted):\n' + missingOkrs.map(o =>
          `- ${o.title} (DRI: ${(o as any).profiles?.full_name}, ${(o as any).profiles?.entity})`
        ).join('\n')
      : '\n\nAll OKRs have been submitted this week.'

    const prompt = `You are an executive assistant preparing a weekly OKR report for the CEO/executive team.

Week: ${weekLabel}
Total OKR updates submitted: ${updates.length}
${missingSummary}

Here are all the OKR updates submitted this week:

${updatesSummary}

Please generate a comprehensive executive report that includes:
1. **Executive Summary** — 2-3 sentence high-level overview of the week
2. **Highlights** — Top 3 wins or strong performers across the org
3. **Risks & Concerns** — Areas with low scores or concerning updates
4. **By Entity Summary** — Brief paragraph per entity/department
5. **Missing Submissions** — Who hasn't submitted and from which entity
6. **Recommended Actions** — 3-5 concrete things leadership should follow up on

Keep it professional, concise, and actionable. Format with clear headers using ##.`

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setReport(data.report || 'Failed to generate report.')
      setGenerated(true)
    } catch (err) {
      setReport('Error generating report. Please try again.')
    }

    setLoading(false)
  }

  function formatReport(text: string) {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="font-display text-2xl font-bold text-ink mt-8 mb-3">{line.replace('## ', '')}</h2>
      if (line.startsWith('### ')) return <h3 key={i} className="font-semibold text-ink mt-5 mb-2">{line.replace('### ', '')}</h3>
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-ink mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>
      if (line.startsWith('- ')) return <li key={i} className="text-sm text-ink ml-4 mb-1 list-disc">{line.replace('- ', '')}</li>
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="text-sm text-ink leading-relaxed mb-2">{line}</p>
    })
  }

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fadeUp delay-1">
        <div className="bg-white border border-surface-2 rounded-sm p-4 text-center">
          <p className="font-display text-3xl font-bold text-ink">{updates.length}</p>
          <p className="text-xs text-muted mt-1">Updates submitted</p>
        </div>
        <div className="bg-white border border-surface-2 rounded-sm p-4 text-center">
          <p className="font-display text-3xl font-bold text-ink">
            {updates.length > 0 ? (updates.reduce((s, u) => s + u.progress_score, 0) / updates.length).toFixed(1) : '—'}
          </p>
          <p className="text-xs text-muted mt-1">Avg progress score</p>
        </div>
        <div className="bg-white border border-surface-2 rounded-sm p-4 text-center">
          <p className="font-display text-3xl font-bold text-accent">{missingOkrs.length}</p>
          <p className="text-xs text-muted mt-1">Missing submissions</p>
        </div>
      </div>

      {/* Generate button */}
      <div className="animate-fadeUp delay-2">
        <button
          onClick={generateReport}
          disabled={loading || updates.length === 0}
          className="bg-ink text-paper px-8 py-3 rounded-sm text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 mb-8"
        >
          {loading ? '⟳ Generating report...' : generated ? '↻ Regenerate Report' : '✦ Generate AI Report'}
        </button>

        {updates.length === 0 && (
          <p className="text-sm text-muted mb-8">No updates submitted this week yet. The report will be available once employees submit their updates.</p>
        )}
      </div>

      {/* Report output */}
      {loading && (
        <div className="bg-white border border-surface-2 rounded-sm p-8 animate-pulse">
          <div className="h-4 bg-surface-2 rounded w-1/3 mb-4"></div>
          <div className="h-3 bg-surface-2 rounded w-full mb-2"></div>
          <div className="h-3 bg-surface-2 rounded w-4/5 mb-2"></div>
          <div className="h-3 bg-surface-2 rounded w-3/4 mb-2"></div>
        </div>
      )}

      {report && !loading && (
        <div className="bg-white border border-surface-2 rounded-sm p-8 animate-fadeUp">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-surface-2">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Executive Report</h2>
              <p className="text-xs text-muted mt-1">{weekLabel} · Generated by AI</p>
            </div>
            <button
              onClick={() => {
                const blob = new Blob([report], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href = url
                a.download = `OKR-Report-${weekLabel.replace(/\s/g, '-')}.txt`
                a.click()
              }}
              className="text-xs text-muted hover:text-accent border border-surface-2 px-3 py-1.5 rounded-sm transition-colors"
            >
              ↓ Download
            </button>
          </div>
          <div>{formatReport(report)}</div>
        </div>
      )}

      {/* Raw updates list */}
      {updates.length > 0 && (
        <div className="mt-10 animate-fadeUp">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">All Updates This Week</h2>
          <div className="space-y-3">
            {updates.map(u => (
              <div key={u.id} className="bg-white border border-surface-2 rounded-sm p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-sm text-ink">{u.okrs?.title}</p>
                    <p className="text-xs text-muted">{u.okrs?.profiles?.full_name} · {u.okrs?.profiles?.entity}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-sm ${
                    u.progress_score >= 4 ? 'bg-green-100 text-success' :
                    u.progress_score >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-accent'
                  }`}>{u.progress_score}/5</span>
                </div>
                <p className="text-sm text-ink leading-relaxed">{u.update_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
