import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, entity')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-paper">
      {/* Top nav */}
      <nav className="border-b border-surface-2 bg-paper sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-accent rounded-sm flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-semibold text-ink">OKR Pulse</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-ink">{profile?.full_name || user.email}</p>
              <p className="text-xs text-muted">{profile?.entity}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
