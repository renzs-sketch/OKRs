'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentWeek } from '@/lib/utils'
import OKRCard from '@/components/OKRCard'
import Link from 'next/link'

export default function UpdateOKRPage({ params }: { params: { id: string } }) {
  const [okr, setOkr] = useState<any>(null)
  const [existingUpdate, setExistingUpdate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const { weekStart, weekEnd, weekLabel } = getCurrentWeek()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      setAuthed(true)
      const user = session.user

      const { data: okrData } = await supabase
        .from('okrs')
        .select('*')
        .eq('id', params.id)
        .eq('assigned_to', user.id)
        .single()

      if (!okrData) {
        setLoading(false)
        return
      }

      setOkr(okrData)

      const { data: updateData } = await supabase
        .from('weekly_updates')
        .select('*')
        .eq('okr_id', okrData.id)
        .eq('user_id', user.id)
        .gte('week_start', weekStart)
        .lte('week_start', weekEnd)
        .maybeSingle()

      setExistingUpdate(updateData || null)
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) return <div className="text-center py-20 text-muted">Loading...</div>
  if (!authed) return <div className="text-center py-20 text-muted">Not authenticated.</div>
  if (!okr) return <div className="text-center py-20 text-muted">OKR not found.</div>

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
        existingUpdate={existingUpdate}
        weekStart={weekStart}
        delay={1}
      />
    </div>
  )
}
