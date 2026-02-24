'use client'

interface Metric {
  name: string
  type: '$' | '%' | '#'
  goal: string
  calculated: boolean
  formula: string
}

interface OKR {
  id: string
  title: string
  entity: string
  metrics?: Metric[]
}

interface Update {
  okr_id: string
  metric_values?: Record<string, string>
}

interface Props {
  okrs: OKR[]
  updates: Update[]
}

function formatValue(val: string, type: string) {
  if (!val || val === '—') return '—'
  const num = Number(val)
  if (isNaN(num)) return val
  if (type === '$') return `$${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  if (type === '%') return `${Math.round(num)}%`
  return num.toLocaleString('en-US')
}

function computeFormula(formula: string, values: Record<string, string>, metrics?: Metric[]): string {
  try {
    let expr = formula.replace(/^\\?"/, '').replace(/\\?"$/, '')
    const allValues = { ...values }
    metrics?.forEach(m => {
      if (m.goal && !allValues[m.name]) {
        allValues[m.name] = m.goal
      }
    })
    Object.entries(allValues).forEach(([name, val]) => {
      expr = expr.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), val || '0')
    })
    if (!/^[\d\s\+\-\*\/\(\)\.]+$/.test(expr)) return '—'
    const result = Function('"use strict"; return (' + expr + ')')()
    return isFinite(result) ? String(Math.round(result)) : '—'
  } catch {
    return '—'
  }
}

function ProgressBar({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min((current / goal) * 100, 100)
  const color = pct >= 90 ? 'bg-emerald-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="mt-3">
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-muted mt-1">{Math.round(pct)}% of goal</p>
    </div>
  )
}

function PercentRing({ value }: { value: number }) {
  const clamped = Math.min(Math.max(value, 0), 100)
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (clamped / 100) * circ
  const color = clamped >= 90 ? '#10b981' : clamped >= 60 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-3 mt-2">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#E0DDD5" strokeWidth="5"/>
        <circle
          cx="32" cy="32" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="37" textAnchor="middle" fontSize="13" fontWeight="600" fill="#0D0D0D">
          {Math.round(clamped)}%
        </text>
      </svg>
    </div>
  )
}

function MetricCard({ metric, value, metrics }: { metric: Metric; value: string; metrics: Metric[] }) {
  const resolvedValue = metric.calculated
    ? computeFormula(metric.formula, { [metric.name]: value }, metrics)
    : value

  const num = Number(resolvedValue)
  const goalNum = Number(metric.goal)
  const hasGoal = metric.goal && !isNaN(goalNum) && goalNum > 0
  const hasValue = resolvedValue && resolvedValue !== '—' && !isNaN(num)

  if (metric.type === '%') {
    return (
      <div className="bg-white border border-surface-2 rounded-sm p-4">
        <p className="text-xs text-muted uppercase tracking-widest truncate">{metric.name}</p>
        {hasValue ? (
          <PercentRing value={num} />
        ) : hasGoal ? (
          <PercentRing value={goalNum} />
        ) : (
          <p className="text-2xl font-mono font-bold text-ink mt-2">—</p>
        )}
        {hasGoal && (
          <p className="text-xs text-muted mt-1">
            {hasValue ? `Goal: ${Math.round(goalNum)}%` : 'Goal (no update yet)'}
          </p>
        )}
      </div>
    )
  }

  if (metric.type === '$') {
    return (
      <div className="bg-white border border-surface-2 rounded-sm p-4">
        <p className="text-xs text-muted uppercase tracking-widest truncate">{metric.name}</p>
        <p className="text-2xl font-mono font-bold text-ink mt-2">
          {hasValue ? formatValue(resolvedValue, '$') : hasGoal ? formatValue(metric.goal, '$') : '—'}
        </p>
        {hasGoal && (
          <p className="text-xs text-muted">
            {hasValue ? `Goal: ${formatValue(metric.goal, '$')}` : 'Goal (no update yet)'}
          </p>
        )}
        {hasValue && hasGoal && <ProgressBar current={num} goal={goalNum} />}
      </div>
    )
  }

  return (
    <div className="bg-white border border-surface-2 rounded-sm p-4">
      <p className="text-xs text-muted uppercase tracking-widest truncate">{metric.name}</p>
      <p className="text-2xl font-mono font-bold text-ink mt-2">
        {hasValue ? formatValue(resolvedValue, '#') : hasGoal ? formatValue(metric.goal, '#') : '—'}
      </p>
      {hasGoal && (
        <p className="text-xs text-muted">
          {hasValue ? `Goal: ${formatValue(metric.goal, '#')}` : 'Goal (no update yet)'}
        </p>
      )}
      {hasValue && hasGoal && <ProgressBar current={num} goal={goalNum} />}
    </div>
  )
}

export default function MetricsDashboard({ okrs, updates }: Props) {
  const okrsWithMetrics = okrs.filter(o => o.metrics && o.metrics.length > 0)
  if (okrsWithMetrics.length === 0) return null

  const entityMap: Record<string, { okr: OKR; metrics: Metric[]; update: Update | undefined }[]> = {}

  okrsWithMetrics.forEach(okr => {
    const entity = okr.entity || 'Unknown'
    if (!entityMap[entity]) entityMap[entity] = []
    const update = updates.find(u => u.okr_id === okr.id)
    entityMap[entity].push({ okr, metrics: okr.metrics!, update })
  })

  return (
    <div className="mb-10 animate-fadeUp">
      <h2 className="font-display text-xl font-semibold text-ink mb-6">Metrics Overview</h2>
      <div className="space-y-8">
        {Object.entries(entityMap).map(([entity, items]) => (
          <div key={entity}>
            <p className="text-xs font-medium text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full inline-block"/>
              {entity}
            </p>
            {items.map(({ okr, metrics, update }) => (
              <div key={okr.id} className="mb-4">
                <p className="text-xs text-muted mb-2 italic">{okr.title}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {metrics.map(m => {
                    const val = update?.metric_values?.[m.name] || '—'
                    return <MetricCard key={m.name} metric={m} value={val} metrics={metrics} />
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
