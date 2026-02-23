'use client'
import { useState } from 'react'

interface Update {
  id: string
  user_id: string
  okr_id: string
  update_text: string
  progress_score: number
  needs_support: boolean
  support_details?: string
  metric_values?: Record<string, string>
}

interface OKR {
  id: string
  title: string
  okr_id: string
  entity: string
  assigned_to: string
  key_results?: string[]
  metrics?: any[]
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
  profiles?: { full_name: string; entity: string }
}

interface Props {
  updates: Update[]
  okrs: OKR[]
  profiles: Profile[]
  mgmtReports: MgmtReport[]
  weekLabel: string
}

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

export default function UpdatesView({ updates, okrs, profiles, mgmtReports, weekLabel }: Props) {
  const [viewBy, setViewBy] = useState<'dri' | 'entity'>('dri')

  function getOKR(okrId: string) { return okrs.find(o => o.id === okrId) }
  function getProfile(userId: string) { return profiles.find(p => p.id === userId) }
  function getMgmtReport(userId: string) { return mgmtReports.find(r => r.user_id === userId) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex border border-surface-2 rounded-sm overflow-hidden">
          <button
            onClick={() => setViewBy('dri')}
            className={`px-4 py-1.5 text-xs font-medium transition-colors ${
              viewBy === 'dri' ? 'bg-ink text-paper' : 'bg-white text-muted hover:text-ink'
            }`}
          >
            By DRI
          </button>
          <button
            onClick={() => setViewBy('entity')}
            className={`px-4 py-1.5 text-xs font-medium transition-colors ${
              viewBy === 'entity' ? 'bg-ink text-paper' : 'bg-white text-muted hover:text-ink'
            }`}
          >
            By Entity
          </button>
        </div>
      </div>

      {updates.length === 0 && mgmtReports.length === 0 && (
        <div className="bg-white border border-surface-2 rounded-sm p-8 text-center">
          <p className="text-muted text-sm">No updates submitted this week yet.</p>
        </div>
      )}

      {viewBy === 'dri' && (() => {
        const allUserIds = Array.from(new Set([
          ...updates.map(u => u.user_id),
          ...mgmtReports.map(r => r.user_id)
        ]))
        if (allUserIds.length === 0) return null
        return (
          <div className="space-y-6">
            {allUserIds.map(userId => {
              const profile = getProfile(userId)
              const userUpdates = updates.filter(u => u.user_id === userId)
              const mgmtReport = getMgmtReport(userId)
              return (
                <div key={userId} className="bg-white border border-surface-2 rounded-sm overflow-hidden">
                  <div className="px-5 py-3 bg-surface border-b border-surface-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-ink">{profile?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted">{profile?.entity}</p>
                    </div>
                    <span className="text-xs text-muted">{userUpdates.length} OKR update{userUpdates.length !== 1 ? 's' : ''}</span>
                  </div>
                  {userUpdates.length > 0 && (
                    <div className="divide-y divide-surface-2">
                      {userUpdates.map(u => {
                        const okr = getOKR(u.okr_id)
                        return (
                          <div key={u.id} className="px-5 py-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="text-xs text-muted">{okr?.okr_id} · {okr?.entity}</p>
                                <p className="text-sm font-medium text-ink">{okr?.title}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {u.needs_support && (
                                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">⚑ Support</span>
                                )}
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scoreColors[u.progress_score]}`}>
                                  {u.progress_score}/5 · {scoreLabels[u.progress_score]}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-ink leading-relaxed">{u.update_text}</p>
                            {u.needs_support && u.support_details && (
                              <div className="mt-2 px-3 py-2 bg-red-50 border border-red-100 rounded-sm">
                                <p className="text-xs text-red-600 font-medium mb-0.5">Needs Tony's support:</p>
                                <p className="text-xs text-red-700">{u.support_details}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {mgmtReport && (
                    <div className="px-5 py-4 bg-surface/50 border-t border-surface-2">
                      <p className="text-xs text-muted uppercase tracking-widest mb-2">Management Report</p>
                      {mgmtReport.report_text && (
                        <p className="text-sm text-ink leading-relaxed mb-2">{mgmtReport.report_text}</p>
                      )}
                      {mgmtReport.attachment_url && (
                        
                          href={mgmtReport.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                          </svg>
                          {mgmtReport.attachment_url}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })()}

      {viewBy === 'entity' && (() => {
        const entityMap: Record<string, OKR[]> = {}
        okrs.forEach(okr => {
          const entity = okr.entity || 'Unknown'
          if (!entityMap[entity]) entityMap[entity] = []
          entityMap[entity].push(okr)
        })
        const entities = Object.keys(entityMap).sort()
        if (entities.length === 0) return null
        return (
          <div className="space-y-8">
            {entities.map(entity => {
              const entityOkrs = entityMap[entity]
              return (
                <div key={entity}>
                  <h3 className="font-display text-lg font-semibold text-ink mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full inline-block" />
                    {entity}
                  </h3>
                  <div className="space-y-4">
                    {entityOkrs.map(okr => {
                      const okrUpdates = updates.filter(u => u.okr_id === okr.id)
                      const krs = okr.key_results || []
                      return (
                        <div key={okr.id} className="bg-white border border-surface-2 rounded-sm overflow-hidden">
                          <div className="px-5 py-3 bg-surface border-b border-surface-2">
                            <p className="text-xs text-muted mb-0.5">{okr.okr_id}</p>
                            <p className="font-medium text-sm text-ink">{okr.title}</p>
                          </div>
                          {okrUpdates.length > 0 ? (
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-surface-2">
                                  <th className="text-left px-5 py-2 text-xs text-muted font-medium uppercase tracking-widest w-1/4">KR</th>
                                  <th className="text-left px-5 py-2 text-xs text-muted font-medium uppercase tracking-widest w-1/6">DRI</th>
                                  <th className="text-left px-5 py-2 text-xs text-muted font-medium uppercase tracking-widest">Update</th>
                                  <th className="text-left px-5 py-2 text-xs text-muted font-medium uppercase tracking-widest w-1/6">Progress</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-surface-2">
                                {okrUpdates.map(u => {
                                  const profile = getProfile(u.user_id)
                                  const kr = krs[0] || '—'
                                  return (
                                    <tr key={u.id}>
                                      <td className="px-5 py-3 text-xs text-muted align-top">{kr}</td>
                                      <td className="px-5 py-3 text-xs font-medium text-ink align-top whitespace-nowrap">{profile?.full_name}</td>
                                      <td className="px-5 py-3 text-xs text-ink align-top leading-relaxed">
                                        {u.update_text}
                                        {u.needs_support && (
                                          <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">⚑ Support</span>
                                        )}
                                      </td>
                                      <td className="px-5 py-3 align-top">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scoreColors[u.progress_score]}`}>
                                          {u.progress_score}/5
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          ) : (
                            <div className="px-5 py-4">
                              <p className="text-xs text-muted italic">No updates submitted yet.</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })()}
    </div>
  )
}
