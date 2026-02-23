import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, entity, password } = await req.json()

    if (!name || !email || !entity || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authUser.user.id,
      email,
      full_name: name,
      entity,
    })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
