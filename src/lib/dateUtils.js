export const getTodayISO = () => {
  const now = new Date()
  const tzOffsetMs = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - tzOffsetMs).toISOString().slice(0, 10)
}

export const toISODate = value => {
  if (!value) return null
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed

  const ddMmYyyySlash = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (ddMmYyyySlash) {
    const [, dd, mm, yyyy] = ddMmYyyySlash
    return `${yyyy}-${mm}-${dd}`
  }

  const ddMmYyyyDash = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (ddMmYyyyDash) {
    const [, dd, mm, yyyy] = ddMmYyyyDash
    return `${yyyy}-${mm}-${dd}`
  }

  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return null
  const tzOffsetMs = parsed.getTimezoneOffset() * 60_000
  return new Date(parsed.getTime() - tzOffsetMs).toISOString().slice(0, 10)
}

export const toDisplayDate = value => {
  const iso = toISODate(value)
  if (!iso) return ''
  const [yyyy, mm, dd] = iso.split('-')
  if (!yyyy || !mm || !dd) return ''
  return `${dd}-${mm}-${yyyy}`
}
