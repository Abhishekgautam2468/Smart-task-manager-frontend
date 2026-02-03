export const statusOf = task => {
  const raw = task?.status ?? (task?.completed ? 'done' : 'todo')
  if (raw == null) return 'todo'
  const normalized = String(raw).toLowerCase().trim()
  if (normalized === 'done' || normalized === 'completed') return 'done'
  if (
    normalized === 'in-progress' ||
    normalized === 'in progress' ||
    normalized === 'in_progress'
  ) {
    return 'in-progress'
  }
  if (
    normalized === 'todo' ||
    normalized === 'to-do' ||
    normalized === 'pending'
  ) {
    return 'todo'
  }
  return normalized
}
