import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentWeek } from '@/lib/utils'
import OKRCard from '@/components/OKRCard'

export default async function EmployeePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()

  // Get employee's OKRs
  const { data: okrs } = await supabase
    .from('okrs')
    .select('*')
    .eq('assigned_to', user.id)
    .eq('is_active', true)
    .order('created_at')

  // Get this week's updates for these OKRs
  const okrIds = okrs?.map(o => o.id) || []
  const { data: updates } = await supabase
    .from('weekly_updates')
    .select('*')
    .in('okr_id', okrIds)
    .gte('week_start', weekStart)
    .lte('week_start', weekEnd)

  const updatesByOkr = (updates || []).reduce((acc, u) => {
    acc[u.okr_id] = u
    return acc
  }, {} as Record<string, any>)

  const submittedCount = Object.keys(updatesByOkr).length
  const totalCount = okrs?.length || 0
  const allSubmitted = submittedCount === totalCount && totalCount > 0

  return (
    <div>
      {/* Header */}
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">Your OKRs</h1>
        <p className="text-muted mt-2 text-sm">Submit your weekly update for each objective below.</p>
      </div>

      {/* Progress bar */}
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

      {/* OKR Cards */}
      <div className="space-y-4">
        {okrs?.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p className="font-display text-xl">No OKRs assigned yet.</p>
            <p className="text-sm mt-2">Your admin will assign objectives soon.</p>
          </div>
        )}
        {okrs?.map((okr, i) => (
          <OKRCard
            key={okr.id}
            okr={okr}
            existingUpdate={updatesByOkr[okr.id] || null}
            weekStart={weekStart}
            delay={i + 2}
          />
        ))}
      </div>
    </div>
  )
}
