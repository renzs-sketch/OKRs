import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
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
          {/* Home */}
          <div className="group relative">
            <Link href="/employee" className="w-10 h-10 rounded-sm flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </Link>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-ink text-paper text-xs px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Home
            </div>
          </div>

          {/* Submit Update */}
          <div className="group relative">
            <Link href="/employee/update" className="w-10 h-10 rounded-sm flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </Link>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-ink text-paper text-xs px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Submit Update
            </div>
          </div>

          {/* Management Report */}
          <div className="group relative">
            <Link href="/employee/report" className="w-10 h-10 rounded-sm flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </Link>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-ink text-paper text-xs px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Management Report
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
      <main className="ml-14 flex-1 max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
