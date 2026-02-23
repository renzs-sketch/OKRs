import { createClient } from '@/lib/supabase/server'
import { getCurrentWeek } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createClient()
  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name')

  const { data: okrs } = await supabase
    .from('okrs')
    .select('*, profiles(full_name, entity)')
    .eq('is_active', true)

  const { data: updates } = await supabase
    .from('weekly_updates')
    .select('*, okrs(title, assigned_to, okr_id), profiles(full_name)')
    .gte('week_start', weekStart)
    .lte('week_start', weekEnd)

  const supportRequests = updates?.filter(u => u.needs_support) || []
  const totalOkrs = okrs?.length || 0
  const totalUpdates = updates?.length || 0
  const submissionRate = totalOkrs > 0 ? Math.round((totalUpdates / totalOkrs) * 100) : 0

  const employeesWithOkrs = profiles?.filter(p => okrs?.some(o => o.assigned_to === p.id))
  const missingSubmissions = employeesWithOkrs?.filter(p => {
    const theirOkrs = okrs?.filter(o => o.assigned_to === p.id) || []
    const theirUpdates = updates?.filter(u => u.user_id === p.id) || []
    return theirUpdates.length < theirOkrs.length
  })

  const avgScore = updates?.length
    ? (updates.reduce((sum, u) => sum + u.progress_score, 0) / updates.length).toFixed(1)
    : '—'

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">Executive Dashboard</h1>
        <p className="text-muted mt-2 text-sm">Weekly OKR submission overview across all entities.</p>
      </div>

      {supportRequests.length > 0 && (
        <div className="mb-10 animate-fadeUp">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-xl font-semibold text-ink">🚩 Needs Tony's Support</h2>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
              {supportRequests.length} this week
            </span>
          </div>
          <div className="space-y-3">
            {supportRequests.map(u => {
              const okr = okrs?.find(o => o.id === u.okr_id)
              const employee = profiles?.find(p => p.id === u.user_id)
              return (
                <div key={u.id} className="bg-white border border-red-200 rounded-sm p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-medium text-sm text-ink">{employee?.full_name}</p>
                      <p className="text-xs text-muted">{employee?.entity} · {(okr as any)?.okr_id} · {okr?.title}</p>
                    </div>
                    <span className="text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-1 rounded-sm shrink-0">
                      Support Needed
                    </span>
                  </div>
                  {u.support_details && (
                    <div className="bg-red-50 rounded-sm px-4 py-3">
                      <p className="text-xs text-red-500 uppercase tracking-widest mb-1">What they need</p>
                      <p className="text-sm text-red-700">{u.support_details}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-fadeUp delay-1">
        {[
          { label: 'Submission Rate', value: `${submissionRate}%`, sub: `${totalUpdates} of ${totalOkrs} OKRs` },
          { label: 'Avg Progress Score', value: avgScore, sub: 'out of 5.0' },
          { label: 'Missing Updates', value: missingSubmissions?.length || 0, sub: 'employees' },
          { label: 'Active OKRs', value: totalOkrs, sub: 'across all entities' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white border border-surface-2 rounded-sm p-5">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">{kpi.label}</p>
            <p className="font-mono text-3xl font-bold text-ink">{kpi.value}</p>
            <p className="text-xs text-muted mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="animate-fadeUp delay-3">
        <h2 className="font-display text-xl font-semibold text-ink mb-4">Pending Submissions</h2>
        {missingSubmissions?.length === 0 ? (
          <div className="bg-white border border-surface-2 rounded-sm p-8 text-center">
            <p className="text-2xl mb-2">✓</p>
            <p className="font-medium text-success">Everyone has submitted!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {missingSubmissions?.map(p => {
              const theirOkrs = okrs?.filter(o => o.assigned_to === p.id) || []
              const theirUpdates = updates?.filter(u => u.user_id === p.id) || []
              const remaining = theirOkrs.length - theirUpdates.length
              return (
                <div key={p.id} className="bg-white border border-surface-2 rounded-sm px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">{p.full_name}</p>
                    <p className="text-xs text-muted">{p.entity}</p>
                  </div>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                    {remaining} pending
                  </span>
                </div>
              )
            })}
          </div>
        )}
        <div className="mt-6">
          <Link
            href="/admin/report"
            className="block w-full text-center bg-ink text-paper py-3 rounded-sm text-sm font-medium hover:bg-accent transition-colors"
          >
            Generate AI Executive Report →
          </Link>
        </div>
      </div>
    </div>
  )
}
