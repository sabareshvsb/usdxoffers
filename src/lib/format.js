// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const usdFormatterCompact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function fmtUSD(value) {
  return usdFormatter.format(Number(value) || 0)
}

export function fmtUSDCompact(value) {
  return usdFormatterCompact.format(Number(value) || 0)
}

export function fmtNum(value) {
  return new Intl.NumberFormat('en-US').format(Number(value) || 0)
}

export function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function fmtDateTimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function pad(n) {
  return String(n).padStart(2, '0')
}