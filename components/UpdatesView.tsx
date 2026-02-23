'use client'
import { useState } from 'react'

/* ================= TYPES ================= */

interface Update {
  id: string
  user_id: string
  okr_id: string
  update_text: string
  progress_score: number
  needs_support: boolean
  support_details?: string
}

interface OKR {
  id: string
  title: string
  okr_id: string
  entity: string
}

interface Profile {
  id: string
  full_name: string
  entity: string
}

interface MgmtReport {
  id: string
  user_id: string
  week_start: string
  report_text?: string
  attachment_url?: string
  submitted_at: string
}

interface Props {
  updates: Update[]
  okrs: OKR[]
  profiles: Profile[]
  mgmtReports: MgmtReport[]
  weekLabel: string
}

/* ================= HELPERS ================= */

const scoreColors: Record<number, string> = {
  1: 'bg-red-100 text-red-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-green-100 text-green-700',
  5: 'bg-emerald-100 text-emerald-700',
}

const scoreLabels: Record<number, string> = {
  1: 'Off track',
  2: 'At risk',
  3: 'On track',
  4: 'Ahead',
  5: 'Exceeded',
}

function getFileName(url?: string) {
  if (!url) return ''
  try {
    return url.split('/').pop()?.split('?')[0] || 'Attachment'
  } catch {
    return 'Attachment'
  }
}

/* ================= COMPONENT ================= */

export default function UpdatesView({
  updates,
  okrs,
  profiles,
  mgmtReports,
  weekLabel,
}: Props) {

  const [viewBy, setViewBy] = useState<'dri' | 'entity'>('dri')

  function getOKR(id: string) {
    return okrs.find(o => o.id === id)
  }

  function getProfile(id: string) {
    return profiles.find(p => p.id === id)
  }

  function getMgmtReport(userId: string) {
    return mgmtReports.find(r => r.user_id === userId)
  }

  const allUserIds = Array.from(new Set([
    ...updates.map(u => u.user_id),
    ...mgmtReports.map(r => r.user_id),
  ]))

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          OKR Updates — {weekLabel}
        </h2>

        <div className="flex border rounded-sm overflow-hidden text-xs">
          <button
            onClick={() => setViewBy('dri')}
            className={`px-3 py-1 ${viewBy === 'dri' ? 'bg-black text-white' : ''}`}
          >
            By DRI
          </button>
          <button
            onClick={() => setViewBy('entity')}
            className={`px-3 py-1 ${viewBy === 'entity' ? 'bg-black text-white' : ''}`}
          >
            By Entity
          </button>
        </div>
      </div>

      {/* EMPTY */}
      {updates.length === 0 && mgmtReports.length === 0 && (
        <div className="border p-6 text-center text-sm text-gray-500">
          No updates submitted this week.
        </div>
      )}

      {/* ================= BY DRI ================= */}
      {viewBy === 'dri' && (
        <div className="space-y-6">
          {allUserIds.map(userId => {

            const profile = getProfile(userId)
            const userUpdates = updates.filter(u => u.user_id === userId)
            const report = getMgmtReport(userId)

            return (
              <div key={userId} className="border rounded-sm bg-white">

                {/* HEADER */}
                <div className="border-b px-4 py-3 bg-gray-50">
                  <div className="font-medium text-sm">
                    {profile?.full_name || 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {profile?.entity}
                  </div>
                </div>

                {/* OKR UPDATES */}
                {userUpdates.map(u => {
                  const okr = getOKR(u.okr_id)

                  return (
                    <div key={u.id} className="px-4 py-3 border-b">

                      <div className="flex justify-between mb-1">
                        <div>
                          <div className="text-xs text-gray-500">
                            {okr?.okr_id} · {okr?.entity}
                          </div>
                          <div className="font-medium text-sm">
                            {okr?.title}
                          </div>
                        </div>

                        <span className={`text-xs px-2 py-0.5 rounded ${scoreColors[u.progress_score]}`}>
                          {u.progress_score}/5 · {scoreLabels[u.progress_score]}
                        </span>
                      </div>

                      <p className="text-sm">{u.update_text}</p>

                      {u.needs_support && (
                        <div className="mt-2 text-xs bg-red-50 border border-red-100 p-2 rounded">
                          Needs support: {u.support_details}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* MANAGEMENT REPORT */}
                {report && (
                  <div className="px-4 py-3 bg-gray-50">

                    <div className="text-xs uppercase text-gray-500 mb-2">
                      Management Report
                    </div>

                    {report.report_text && (
                      <p className="text-sm mb-2">
                        {report.report_text}
                      </p>
                    )}

                    {report.attachment_url && (
                      <a
                        href={report.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        📎 View Attachment — {getFileName(report.attachment_url)}
                      </a>
                    )}
                  </div>
                )}

              </div>
            )
          })}
        </div>
      )}

      {/* ================= BY ENTITY ================= */}
      {viewBy === 'entity' && (
        <div className="text-sm text-gray-500">
          Entity view coming soon 🙂
        </div>
      )}

    </div>
  )
}
