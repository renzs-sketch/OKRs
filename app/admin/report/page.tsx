import { createClient } from '@/lib/supabase/server'
import { getCurrentWeek } from '@/lib/utils'
import AIReportClient from '@/components/AIReportClient'

export default async function ReportPage() {
  const supabase = createClient()
  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()

  // Fetch everything needed for the report
  const { data: updates } = await supabase
    .from('weekly_updates')
    .select('*, okrs(title, description, key_results, quarter, profiles(full_name, entity))')
    .gte('week_start', weekStart)
    .lte('week_start', weekEnd)
    .order('submitted_at', { ascending: false })

  const { data: allOkrs } = await supabase
    .from('okrs')
    .select('*, profiles(full_name, entity)')
    .eq('is_active', true)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, entity')

  // Determine who hasn't submitted
  const submittedOkrIds = new Set(updates?.map(u => u.okr_id))
  const missingOkrs = allOkrs?.filter(o => !submittedOkrIds.has(o.id)) || []

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">AI Executive Report</h1>
        <p className="text-muted mt-2 text-sm">AI-generated analysis of this week's OKR updates.</p>
      </div>

      <AIReportClient
        updates={updates || []}
        missingOkrs={missingOkrs}
        weekLabel={weekLabel}
      />
    </div>
  )
}
