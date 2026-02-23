import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const isAdmin = user.email === process.env.ADMIN_EMAIL
  redirect(isAdmin ? '/admin' : '/employee')
}
