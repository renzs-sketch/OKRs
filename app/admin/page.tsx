import { createClient } from '@/lib/supabase/server'
import { getCurrentWeek } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createClient()
  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()

  // Get all employees (profiles)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name')

  // Get all active OKRs
  const { data: okrs } = await supabase
    .from('okrs')
    .select('*, profiles(full_name, entity)')
    .eq('is_active', true)

  // Get this week's updates
  const { data: updates } = await supabase
    .from('weekly_updates')
    .select('*, okrs(title, assigned_to), profiles(full_name)')
    .gte('week_start', weekStart)
    .lte('week_start', weekEnd)

  const totalOkrs = okrs?.length || 0
  const totalUpdates = updates?.length || 0
  const submissionRate = totalOkrs > 0 ? Math.round((totalUpdates / totalOkrs) * 100) : 0

  // Group by employee to find who hasn't submitted
  const employeesWithOkrs = profiles?.filter(p => okrs?.some(o => o.assigned_to === p.id))
  const submittedUserIds = new Set(updates?.map(u => u.user_id))
  const missingSubmissions = employeesWithOkrs?.filter(p => {
    const theirOkrs = okrs?.filter(o => o.assigned_to === p.id) || []
    const theirUpdates = updates?.filter(u => u.user_id === p.id) || []
    return theirUpdates.length < theirOkrs.length
  })

  // Average score
  const avgScore = updates?.length
    ? (updates.reduce((sum, u) => sum + u.progress_score, 0) / updates.length).toFixed(1)
    : '—'

  // Group by entity
  const entityMap: Record<string, { submitted: number; total: number; avgScore: number }> = {}
  okrs?.forEach(okr => {
    const entity = (okr as any).profiles?.entity || 'Unknown'
    if (!entityMap[entity]) entityMap[entity] = { submitted: 0, total: 0, avgScore: 0 }
    entityMap[entity].total++
  })
  updates?.forEach(u => {
    const okr = okrs?.find(o => o.id === u.okr_id)
    const entity = (okr as any)?.profiles?.entity || 'Unknown'
    if (entityMap[entity]) {
      entityMap[entity].submitted++
      entityMap[entity].avgScore += u.progress_score
    }
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">Executive Dashboard</h1>
        <p className="text-muted mt-2 text-sm">Weekly OKR submission overview across all entities.</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-fadeUp delay-1">
        {[
          { label: 'Submission Rate', value: `${submissionRate}%`, sub: `${totalUpdates} of ${totalOkrs} OKRs` },
          { label: 'Avg Progress Score', value: avgScore, sub: 'out of 5.0' },
          { label: 'Missing Updates', value: missingSubmissions?.length || 0, sub: 'employees' },
          { label: 'Active OKRs', value: totalOkrs, sub: 'across all entities' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white border border-surface-2 rounded-sm p-5">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">{kpi.label}</p>
            <p className="font-display text-3xl font-bold text-ink">{kpi.value}</p>
            <p className="text-xs text-muted mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* By Entity */}
        <div className="animate-fadeUp delay-2">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">By Entity</h2>
          <div className="space-y-3">
            {Object.entries(entityMap).map(([entity, data]) => {
              const rate = data.total > 0 ? Math.round((data.submitted / data.total) * 100) : 0
              const avg = data.submitted > 0 ? (data.avgScore / data.submitted).toFixed(1) : '—'
              return (
                <div key={entity} className="bg-white border border-surface-2 rounded-sm p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm text-ink">{entity}</span>
                    <div className="flex gap-3 text-xs text-muted">
                      <span>Avg: <strong className="text-ink">{avg}</strong></span>
                      <span>{data.submitted}/{data.total}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${rate === 100 ? 'bg-success' : rate >= 50 ? 'bg-warning' : 'bg-accent'}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted mt-1">{rate}% submitted</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Missing submissions */}
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
    </div>
  )
}
