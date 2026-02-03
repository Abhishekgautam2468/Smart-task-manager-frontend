import { getTodayISO, toISODate } from '@/lib/dateUtils'
import { statusOf } from './taskStatus'

export const computeVisibleTasks = ({ tasks, selectedView, selectedPriority }) => {
  const todayISO = getTodayISO()
  const view =
    (selectedView || 'today') === 'pending'
      ? 'overdue'
      : selectedView || 'today'

  const byView = (tasks || []).filter(t => {
    if (view === 'sticky') return Boolean(t.stickyWall)
    if (view === 'completed') return statusOf(t) === 'done'
    if (view === 'ongoing') return statusOf(t) === 'in-progress'
    const status = statusOf(t)
    if (status === 'done') return false
    if (view === 'all') return true

    const dueISO = toISODate(t.dueDate)
    if (view === 'today') return dueISO === todayISO
    if (view === 'overdue') {
      return (
        status !== 'in-progress' && Boolean(dueISO) && dueISO < todayISO
      )
    }
    if (view === 'upcoming') {
      return status !== 'in-progress' && (!dueISO || dueISO > todayISO)
    }
    return true
  })

  const prioritized = selectedPriority
    ? byView.filter(t => (t.priority || 'medium') === selectedPriority)
    : byView

  if (view !== 'all') return prioritized

  return [...prioritized].sort((a, b) => {
    const aDue = toISODate(a.dueDate)
    const bDue = toISODate(b.dueDate)

    if (!aDue && !bDue) {
      const aCreated = a.createdAt ? Date.parse(a.createdAt) : 0
      const bCreated = b.createdAt ? Date.parse(b.createdAt) : 0
      return bCreated - aCreated
    }
    if (!aDue) return 1
    if (!bDue) return -1
    if (aDue === bDue) {
      const aCreated = a.createdAt ? Date.parse(a.createdAt) : 0
      const bCreated = b.createdAt ? Date.parse(b.createdAt) : 0
      return bCreated - aCreated
    }
    return aDue < bDue ? -1 : 1
  })
}
