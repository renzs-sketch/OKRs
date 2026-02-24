'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentWeek } from '@/lib/utils'
import Link from 'next/link'

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

  const scoreColors: Record<number, string> = {
    1: 'bg-red-100 text-red-700',
    2: 'bg-orange-100 text-orange-700',
    3: 'bg-yellow-100 text-yellow-700',
    4: 'bg-green-100 text-green-700',
    5: 'bg-emerald-100 text-emerald-700',
  }

  const scoreLabels: Record<number, string> = {
    1: 'Off track',
    2: 'At risk',
    3: 'On track',
    4: 'Ahead',
    5: 'Exceeded',
  }

  if (loading) return <div className="text-center py-20 text-muted">Loading...</div>

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{weekLabel}</p>
        <h1 className="font-display text-4xl font-bold text-ink">Your OKRs</h1>
        <p className="text-muted mt-2 text-sm">Click on any OKR to submit or update your weekly progress.</p>
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

      {/* OKR List */}
      <div className="space-y-3 animate-fadeUp delay-2">
        {okrs.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p className="font-display text-xl">No OKRs assigned yet.</p>
            <p className="text-sm mt-2">Your admin will assign objectives soon.</p>
          </div>
        )}
        {okrs.map(okr => {
          const update = updates[okr.id]
          const hasUpdate = !!update
          return (
            <Link
              key={okr.id}
              href={`/employee/update/${okr.id}`}
              className="block bg-white border border-surface-2 rounded-sm px-5 py-4 hover:border-ink transition-colors group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted uppercase tracking-widest">{okr.quarter}</span>
                    {okr.entity && (
                      <span className="text-xs text-muted">· {okr.entity}</span>
                    )}
                  </div>
                  <p className="font-medium text-sm text-ink truncate">{okr.title}</p>
                  {okr.key_results?.length > 0 && (
                    <p className="text-xs text-muted mt-1 truncate">
                      {okr.key_results.length} key result{okr.key_results.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {hasUpdate ? (
                    <>
                      <span className={`text-xs px-2 py-1 rounded-sm font-medium ${scoreColors[update.progress_score]}`}>
                        {scoreLabels[update.progress_score]}
                      </span>
                      <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-sm font-medium">
                        ✓ Submitted
                      </span>
                    </>
                  ) : (
                    <span className="text-xs bg-surface text-muted px-2 py-1 rounded-sm border border-surface-2">
                      Pending
                    </span>
                  )}
                  <svg className="text-muted group-hover:text-ink transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
