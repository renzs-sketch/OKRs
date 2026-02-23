import { createClient } from '@/lib/supabase/server'
import AddEmployeeForm from '@/components/AddEmployeeForm'

export default async function EmployeesPage() {
  const supabase = createClient()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name')

  const { data: okrs } = await supabase.from('okrs').select('assigned_to').eq('is_active', true)

  const okrCountByUser = (okrs || []).reduce((acc, o) => {
    acc[o.assigned_to] = (acc[o.assigned_to] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div>
      <div className="mb-10 animate-fadeUp">
        <h1 className="font-display text-4xl font-bold text-ink">Employees</h1>
        <p className="text-muted mt-2 text-sm">Manage employee accounts and access.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="animate-fadeUp delay-1">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">Add Employee</h2>
          <AddEmployeeForm />
        </div>

        <div className="animate-fadeUp delay-2">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">All Employees ({profiles?.length || 0})</h2>
          <div className="space-y-2">
            {profiles?.map(p => (
              <div key={p.id} className="bg-white border border-surface-2 rounded-sm px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">{p.full_name}</p>
                  <p className="text-xs text-muted">{p.email} · {p.entity}</p>
                </div>
                <span className="text-xs text-muted">{okrCountByUser[p.id] || 0} OKRs</span>
              </div>
            ))}
            {profiles?.length === 0 && (
              <p className="text-sm text-muted">No employees yet. Add your first one!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
