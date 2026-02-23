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
  metrics?: any[]
}

interface Profile {
  id: string
  full_name: string
  entity: string
}

interface Props {
  updates: Update[]
  okrs: OKR[]
  profiles: Profile[]
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

export default function UpdatesView({ updates, okrs, profiles }: Props) {
  const [viewBy, setViewBy] = useState<'dri' | 'entity'>('dri')

  function getOKR(okrId: string) {
    return okrs.find(o => o.id === okrId)
  }

  function getProfile(userId: string) {
    return profiles.find(p => p.id === userId)
  }

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold text-ink">Weekly Updates</h2>
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

      {updates.length === 0 && (
        <div className="bg-white border border-surface-2 rounded-sm p-8 text-center">
          <p className="text-muted text-sm">No updates submitted this week yet.</p>
        </div>
      )}

      {/* BY DRI */}
      {viewBy === 'dri' && updates.length > 0 && (() => {
        // Group updates by user
        const byUser: Record<string, Update[]> = {}
        updates.forEach(u => {
          if (!byUser[u.user_id]) byUser[u.user_id] = []
          byUser[u.user_id].push(u)
        })

        return (
          <div className="space-y-4">
            {Object.entries(byUser).map(([userId, userUpdates]) => {
              const profile = getProfile(userId)
              return (
                <div key={userId} className="bg-white border border-surface-2 rounded-sm overflow-hidden">
                  {/* Employee header */}
                  <div className="px-5 py-3 bg-surface border-b border-surface-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-ink">{profile?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted">{profile?.entity}</p>
                    </div>
                    <span className="text-xs text-muted">{userUpdates.length} update{userUpdates.length > 1 ? 's' : ''}</span>
                  </div>

                  {/* Their updates */}
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
                </div>
              )
            })}
          </div>
        )
      })()}

      {/* BY ENTITY */}
      {viewBy === 'entity' && updates.length > 0 && (() => {
        // Group by OKR entity, then by user
        const byEntity: Record<string, Record<string, Update[]>> = {}
        updates.forEach(u => {
          const okr = getOKR(u.okr_id)
          const entity = okr?.entity || 'Unknown'
          if (!byEntity[entity]) byEntity[entity] = {}
          if (!byEntity[entity][u.user_id]) byEntity[entity][u.user_id] = []
          byEntity[entity][u.user_id].push(u)
        })

        return (
          <div className="space-y-6">
            {Object.entries(byEntity).map(([entity, userMap]) => (
              <div key={entity}>
                <h3 className="font-display text-base font-semibold text-ink mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full inline-block" />
                  {entity}
                </h3>
                <div className="space-y-3">
                  {Object.entries(userMap).map(([userId, userUpdates]) => {
                    const profile = getProfile(userId)
                    return (
                      <div key={userId} className="bg-white border border-surface-2 rounded-sm overflow-hidden">
                        <div className="px-5 py-3 bg-surface border-b border-surface-2 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-ink">{profile?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-muted">{profile?.entity}</p>
                          </div>
                          <span className="text-xs text-muted">{userUpdates.length} OKR{userUpdates.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="divide-y divide-surface-2">
                          {userUpdates.map(u => {
                            const okr = getOKR(u.okr_id)
                            return (
                              <div key={u.id} className="px-5 py-4">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div>
                                    <p className="text-xs text-muted">{okr?.okr_id}</p>
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
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )
      })()}
    </div>
  )
}
