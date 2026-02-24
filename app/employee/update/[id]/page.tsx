import { createClient } from '@/lib/supabase/server'
import { getCurrentWeek } from '@/lib/utils'
import OKRCard from '@/components/OKRCard'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function UpdateOKRPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: okr } = await supabase
    .from('okrs')
    .select('*')
    .eq('id', params.id)
    .eq('assigned_to', user.id)
    .single()

  if (!okr) redirect('/employee')

  const { data: existingUpdate } = await supabase
    .from('weekly_updates')
    .select('*')
    .eq('okr_id', okr.id)
    .eq('user_id', user.id)
    .gte('week_start', weekStart)
    .lte('week_start', weekEnd)
    .single()

  return (
    <div>
      <div className="mb-6 animate-fadeUp">
        <Link href="/employee" className="text-xs text-muted hover:text-ink transition-colors flex items-center gap-1 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to OKRs
        </Link>
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">Submit Update</h1>
        <p className="text-muted mt-2 text-sm">Update your progress for this objective.</p>
      </div>

      <OKRCard
        okr={okr}
        existingUpdate={existingUpdate || null}
        weekStart={weekStart}
        delay={1}
      />
    </div>
  )
}
