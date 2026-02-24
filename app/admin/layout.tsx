import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper flex">
      {/* Left Icon Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-14 bg-white border-r border-surface-2 flex flex-col items-center py-6 z-20">
        {/* Logo */}
        <div className="w-7 h-7 bg-accent rounded-sm flex items-center justify-center mb-8">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <nav className="flex flex-col items-center gap-1 flex-1">
          {/* Dashboard */}
          <div className="group relative">
            <Link href="/admin" className="w-10 h-10 rounded-sm flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </Link>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-ink text-paper text-xs px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Dashboard
            </div>
          </div>

          {/* Manage OKRs */}
          <div className="group relative">
            <Link href="/admin/okrs" className="w-10 h-10 rounded-sm flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </Link>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-ink text-paper text-xs px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Manage OKRs
            </div>
          </div>

          {/* Employees */}
          <div className="group relative">
            <Link href="/admin/employees" className="w-10 h-10 rounded-sm flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </Link>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-ink text-paper text-xs px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Employees
            </div>
          </div>

          {/* Employee Updates */}
          <div className="group relative">
            <Link href="/admin/updates" className="w-10 h-10 rounded-sm flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </Link>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-ink text-paper text-xs px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Employee Updates
            </div>
          </div>

          {/* Support Requests */}
          <div className="group relative">
            <Link href="/admin/support" className="w-10 h-10 rounded-sm flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
            </Link>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-ink text-paper text-xs px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Support Requests
            </div>
          </div>

          {/* AI Report */}
          <div className="group relative">
            <Link href="/admin/report" className="w-10 h-10 rounded-sm flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </Link>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-ink text-paper text-xs px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              AI Report
            </div>
          </div>
        </nav>

        {/* Logout at bottom */}
        <div className="group relative">
          <div className="w-10 h-10 rounded-sm flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer">
            <LogoutButton iconOnly />
          </div>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-ink text-paper text-xs px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Logout
          </div>
        </div>
      </aside>

      {/* Main content offset for sidebar */}
      <main className="ml-14 flex-1 max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
