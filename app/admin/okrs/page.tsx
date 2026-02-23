import { createClient } from '@/lib/supabase/server'
import CreateOKRForm from '@/components/CreateOKRForm'

export default async function ManageOKRsPage() {
  const supabase = createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, entity')
    .order('full_name')

  const { data: okrs } = await supabase
    .from('okrs')
    .select('*, profiles(full_name, entity)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <h1 className="font-display text-4xl font-bold text-ink">Manage OKRs</h1>
        <p className="text-muted mt-2 text-sm">Create and assign OKRs to employees.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Create form */}
        <div className="animate-fadeUp delay-1">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">Create New OKR</h2>
          <CreateOKRForm profiles={profiles || []} />
        </div>

        {/* Existing OKRs */}
        <div className="animate-fadeUp delay-2">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">All OKRs ({okrs?.length || 0})</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {okrs?.map(okr => (
              <div key={okr.id} className={`bg-white border rounded-sm p-4 ${!okr.is_active ? 'opacity-50' : 'border-surface-2'}`}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-medium text-sm text-ink">{okr.title}</p>
                    <p className="text-xs text-muted mt-0.5">{(okr as any).profiles?.full_name} · {(okr as any).profiles?.entity} · {okr.quarter}</p>
                  </div>
                  {!okr.is_active && <span className="text-xs text-muted shrink-0">Archived</span>}
                </div>
                {okr.key_results?.length > 0 && (
                  <div className="mt-2 space-y-0.5">
                    {okr.key_results.map((kr: string, i: number) => (
                      <p key={i} className="text-xs text-muted">KR{i + 1}: {kr}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
