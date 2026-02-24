import { createClient } from '@/lib/supabase/server'
import { getCurrentWeek } from '@/lib/utils'
import ManagementReportForm from '@/components/ManagementReportForm'

export default async function EmployeeReportPage() {
  const supabase = createClient()
  const { weekStart, weekLabel } = getCurrentWeek()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: existingReport } = await supabase
    .from('management_reports')
    .select('*')
    .eq('user_id', user?.id)
    .eq('week_start', weekStart)
    .single()

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">Management Report</h1>
        <p className="text-muted mt-2 text-sm">Submit your weekly management report.</p>
      </div>
      <ManagementReportForm
        userId={user?.id || ''}
        weekStart={weekStart}
        existingReport={existingReport}
      />
    </div>
  )
}
