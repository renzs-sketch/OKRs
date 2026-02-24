import { createClient } from '@/lib/supabase/server'
import { getCurrentWeek } from '@/lib/utils'

export default async function SupportPage() {
  const supabase = createClient()
  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')

  const { data: okrs } = await supabase
    .from('okrs')
    .select('*')
    .eq('is_active', true)

  const { data: updates } = await supabase
    .from('weekly_updates')
    .select('*')
    .eq('needs_support', true)
    .gte('week_start', weekStart)
    .lte('week_start', weekEnd)

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">Needs Support</h1>
        <p className="text-muted mt-2 text-sm">Employees requesting Tony's attention this week.</p>
      </div>

      {updates?.length === 0 ? (
        <div className="bg-white border border-surface-2 rounded-sm p-12 text-center">
          <p className="text-2xl mb-2">✓</p>
          <p className="font-medium text-success">No support requests this week!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {updates?.map(u => {
            const okr = okrs?.find(o => o.id === u.okr_id)
            const employee = profiles?.find(p => p.id === u.user_id)
            return (
              <div key={u.id} className="bg-white border border-red-200 rounded-sm p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-medium text-sm text-ink">{employee?.full_name}</p>
                    <p className="text-xs text-muted">{employee?.entity} · {okr?.okr_id} · {okr?.title}</p>
                  </div>
                  <span className="text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-1 rounded-sm shrink-0">
                    Support Needed
                  </span>
                </div>
                {u.support_details && (
                  <div className="bg-red-50 rounded-sm px-4 py-3">
                    <p className="text-xs text-red-500 uppercase tracking-widest mb-1">What they need</p>
                    <p className="text-sm te
