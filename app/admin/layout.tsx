import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <nav className="border-b border-surface-2 bg-paper sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-accent rounded-sm flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-semibold text-ink">OKR Pulse</span>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/admin" className="text-xs px-3 py-1.5 rounded-sm text-ink hover:bg-surface transition-colors">Dashboard</Link>
              <Link href="/admin/okrs" className="text-xs px-3 py-1.5 rounded-sm text-ink hover:bg-surface transition-colors">Manage OKRs</Link>
              <Link href="/admin/employees" className="text-xs px-3 py-1.5 rounded-sm text-ink hover:bg-surface transition-colors">Employees</Link>
              <Link href="/admin/report" className="text-xs px-3 py-1.5 rounded-sm text-ink hover:bg-surface transition-colors">AI Report</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted hidden sm:block">Admin</span>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
