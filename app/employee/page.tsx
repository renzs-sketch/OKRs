'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentWeek } from '@/lib/utils'
import OKRCard from '@/components/OKRCard'

export default function EmployeePage() {
  const [okrs, setOkrs] = useState<any[]>([])
  const [updates, setUpdates] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: okrData } = await supabase
        .from('okrs')
        .select('*')
        .eq('assigned_to', user.id)
        .eq('is_active', true)
        .order('created_at')

      setOkrs(okrData || [])

      if (okrData && okrData.length > 0) {
        const ids = okrData.map(o => o.id)
        const { data: updateData } = await supabase
          .from('weekly_updates')
          .select('*')
          .in('okr_id', ids)
          .gte('week_start', weekStart)
          .lte('week_start', weekEnd)

        const map = (updateData || []).reduce((acc, u) => {
          acc[u.okr_id] = u
          return acc
        }, {} as Record<string, any>)
        setUpdates(map)
      }

      setLoading(false)
    }
    load()
  }, [])

  const submittedCount = Object.keys(updates).length
  const totalCount = okrs.length
  const allSubmitted = submittedCount === totalCount && totalCount > 0

  if (loading) return <div className="text-center py-20 text-muted">Loading...</div>

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">Your OKRs</h1>
        <p className="text-muted mt-2 text-sm">Submit your weekly update for each objective below.</p>
      </div>

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

      <div className="space-y-4">
        {okrs.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p className="font-display text-xl">No OKRs assigned yet.</p>
            <p className="text-sm mt-2">Your admin will assign objectives soon.</p>
          </div>
        )}
        {okrs.map((okr, i) => (
          <OKRCard
            key={okr.id}
            okr={okr}
            existingUpdate={updates[okr.id] || null}
            weekStart={weekStart}
            delay={i + 2}
          />
        ))}
      </div>
    </div>
  )
}
