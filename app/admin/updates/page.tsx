import { createClient } from '@/lib/supabase/server'
import { getCurrentWeek } from '@/lib/utils'
import UpdatesView from '@/components/UpdatesView'

export default async function EmployeeUpdatesPage() {
  const supabase = createClient()
  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name')

  const { data: okrs } = await supabase
    .from('okrs')
    .select('*')
    .eq('is_active', true)

  const { data: updates } = await supabase
    .from('weekly_updates')
    .select('*')
    .gte('week_start', weekStart)
    .lte('week_start', weekEnd)

  const { data: mgmtReports } = await supabase
    .from('management_reports')
    .select('*, profiles(full_name, entity)')
    .eq('week_start', weekStart)

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">Employee Updates</h1>
        <p className="text-muted mt-2 text-sm">This week's OKR updates and management reports.</p>
      </div>
      <UpdatesView
        updates={updates || []}
        okrs={okrs || []}
        profiles={profiles || []}
        mgmtReports={mgmtReports || []}
        weekLabel={weekLabel}
      />
    </div>
  )
}
