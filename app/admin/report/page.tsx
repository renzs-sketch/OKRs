import { createClient } from '@/lib/supabase/server'
import { getCurrentWeek } from '@/lib/utils'
import AIReportClient from '@/components/AIReportClient'
import { format, isAfter, parseISO } from 'date-fns'

export default async function ReportPage() {
  const supabase = createClient()
  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()

  // Submission window is Thursday to Sunday (Friday practice)
  const weekStartDate = parseISO(weekStart)
  const submissionWindowStart = new Date(weekStartDate)
  submissionWindowStart.setDate(weekStartDate.getDate() + 3) // Thursday
  const submissionWindowLabel = `${format(submissionWindowStart, 'MMM d')} – ${format(parseISO(weekEnd), 'MMM d, yyyy')}`

  // Today's date
  const today = new Date()
  const isSubmissionWindowOpen = isAfter(today, submissionWindowStart)

  // Fetch this week's updates
  const { data: updates } = await supabase
    .from('weekly_updates')
    .select('*, okrs(title, description, key_results, quarter, profiles(full_name, entity))')
    .gte('week_start', weekStart)
    .lte('week_start', weekEnd)
    .order('submitted_at', { ascending: false })

  // Also fetch management reports for this week
  const { data: mgmtReports } = await supabase
    .from('management_reports')
    .select('*, profiles(full_name, entity)')
    .eq('week_start', weekStart)

  const { data: allOkrs } = await supabase
    .from('okrs')
    .select('*, profiles(full_name, entity)')
    .eq('is_active', true)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, entity')

  // Determine missing OKR submissions
  const submittedOkrIds = new Set(updates?.map(u => u.okr_id))
  const missingOkrs = allOkrs?.filter(o => !submittedOkrIds.has(o.id)) || []

  // Determine who submitted management report
  const mgmtReportUserIds = new Set(mgmtReports?.map(r => r.user_id))

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">AI Executive Report</h1>
        <p className="text-muted mt-2 text-sm">
          AI-generated analysis of this week's OKR updates.
          {' '}<span className="text-ink font-medium">Submission window: {submissionWindowLabel}</span>
          {isSubmissionWindowOpen
            ? <span className="ml-2 text-xs bg-green-100 text-success px-2 py-0.5 rounded-full">Window Open</span>
            : <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Window Opens Thursday</span>
          }
        </p>
      </div>
      <AIReportClient
        updates={updates || []}
        missingOkrs={missingOkrs}
        mgmtReports={mgmtReports || []}
        weekLabel={weekLabel}
        submissionWindowLabel={submissionWindowLabel}
        isSubmissionWindowOpen={isSubmissionWindowOpen}
      />
    </div>
  )
}
```

Now I also need to update `components/AIReportClient.tsx` to use the new props and include the submission window context in the AI prompt. Give me the current contents:
```
https://github.com/renzs-sketch/OKRs/blob/main/components/AIReportClient.tsx
