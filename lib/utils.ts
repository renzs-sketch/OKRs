import { startOfWeek, endOfWeek, format } from 'date-fns'

export function getCurrentWeek() {
  const now = new Date()
  const start = startOfWeek(now, { weekStartsOn: 1 }) // Monday
  const end = endOfWeek(now, { weekStartsOn: 1 })     // Sunday

  return {
    weekStart: format(start, 'yyyy-MM-dd'),
    weekEnd: format(end, 'yyyy-MM-dd'),
    weekLabel: `Week of ${format(start, 'MMMM d')} – ${format(end, 'd, yyyy')}`,
  }
}
