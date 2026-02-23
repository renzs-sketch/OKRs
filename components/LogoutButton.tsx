'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
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
