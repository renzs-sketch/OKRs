import { createClient } from '@/lib/supabase/server'
import { getCurrentWeek } from '@/lib/utils'
import OKRCard from '@/components/OKRCard'

export default async function SubmitUpdatePage() {
  const supabase = createClient()
  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: okrs } = await supabase
    .from('okrs')
    .select('*')
    .eq('assigned_to', user?.id)
    .eq('is_active', true)

  const { data: updates } = await supabase
    .from('weekly_updates')
    .select('*')
    .eq('user_id', user?.id)
    .gte('week_start', weekStart)
    .lte('week_start', weekEnd)

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">Submit Update</h1>
        <p className="text-muted mt-2 text-sm">Update your OKR progress for this week.</p>
      </div>
      <div className="space-y-6">
        {okrs?.map(okr => {
          const existingUpdate = updates?.find(u => u.okr_id === okr.id)
          return (
            <OKRCard
              key={okr.id}
              okr={okr}
              existingUpdate={existingUpdate}
              weekStart={weekStart}
            />
          )
        })}
      </div>
    </div>
  )
}
