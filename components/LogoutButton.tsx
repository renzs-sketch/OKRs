'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const supabase = createClient()
  const router = useRouter()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (iconOnly) {
    return (
      <button onClick={logout} className="w-10 h-10 flex items-center justify-center text-muted hover:text-ink transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={logout}
      className="text-xs text-muted hover:text-accent transition-colors px-3 py-1.5 border border-surface-2 rounded-sm"
    >
      Sign out
    </button>
  )
}
