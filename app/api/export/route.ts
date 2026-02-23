import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()

    // Fetch all data
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name')

    const { data: okrs } = await supabase
      .from('okrs')
      .select('*, profiles(full_name, entity)')
      .order('created_at')

    const { data: updates } = await supabase
      .from('weekly_updates')
      .select('*, okrs(title, okr_id, profiles(full_name, entity))')
      .order('week_start', { ascending: false })

    const { data: mgmtReports } = await supabase
      .from('management_reports')
      .select('*, profiles(full_name, entity)')
      .order('week_start', { ascending: false })

    const employeesData = (profiles || []).map(p => ({
      'Full Name': p.full_name,
      'Email': p.email,
      'Entity': p.entity,
      'Role': p.role || 'employee',
      'Created At': p.created_at ? new Date(p.created_at).toLocaleDateString() : '',
    }))

    const okrsData = (okrs || []).map(o => ({
      'OKR ID': o.okr_id || '',
      'Objective': o.title,
      'Description': o.description || '',
      'Entity': o.entity || (o as any).profiles?.entity || '',
      'Quarter': o.quarter,
      'DRI': (o as any).profiles?.full_name || '',
      'Key Results': (o.key_results || []).join(' | '),
      'Status': o.is_active ? 'Active' : 'Archived',
      'Created At': o.created_at ? new Date(o.created_at).toLocaleDateString() : '',
    }))

    const updatesData = (updates || []).map(u => ({
      'Week Of': u.week_start,
      'Employee': (u as any).okrs?.profiles?.full_name || '',
      'Entity': (u as any).okrs?.profiles?.entity || '',
      'OKR ID': (u as any).okrs?.okr_id || '',
      'OKR Title': (u as any).okrs?.title || '',
      'Progress Score': u.progress_score,
      'Update': u.update_text,
      'Submitted At': u.submitted_at ? new Date(u.submitted_at).toLocaleString() : '',
    }))

    const reportsData = (mgmtReports || []).map(r => ({
      'Week Of': r.week_start,
      'Employee': (r as any).profiles?.full_name || '',
      'Entity': (r as any).profiles?.entity || '',
      'Report': r.report_text || '',
      'Attachment Link': r.attachment_url || '',
      'Submitted At': r.submitted_at ? new Date(r.submitted_at).toLocaleString() : '',
    }))

    return NextResponse.json({
      employees: employeesData,
      okrs: okrsData,
      updates: updatesData,
      management_reports: reportsData,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
