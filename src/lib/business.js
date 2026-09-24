// ---------------------------------------------------------------------------
// Pure business logic for the USDX-SMART campaign.
// UI components must never compute campaign rules inline — they delegate here.
// These helpers are "API ready": they operate on plain state objects so a real
// backend can replace localStorage without touching the UI.
// ---------------------------------------------------------------------------

export const SECONDS_PER_DAY = 86400

export function luckyEntries(volume, entryPer = 2000) {
  const v = Number(volume) || 0
  if (v < 0) return 0
  return Math.floor(v / entryPer)
}

export function isLuckyQualified(volume, threshold = 2000) {
  return (Number(volume) || 0) >= threshold
}

export function isCarQualified(volume, threshold = 30000) {
  return (Number(volume) || 0) >= threshold
}

export function rankLeaders(leaders) {
  const sorted = [...leaders].sort((a, b) => {
    const diff = (Number(b.volume) || 0) - (Number(a.volume) || 0)
    if (diff !== 0) return diff
    return String(a.updatedAt).localeCompare(String(b.updatedAt))
  })
  const map = new Map()
  let rank = 0
  let previous = null
  sorted.forEach((leader, i) => {
    if (previous === null || Number(leader.volume) !== previous) {
      rank = i + 1
    }
    map.set(leader.id, rank)
    previous = Number(leader.volume)
  })
  return { sorted, map }
}

export function totals(state) {
  const leaders = state.leaders || []
  const luckyOffer = state.offers?.lucky50
  const carOffer = state.offers?.tripleCar

  const totalLeaders = leaders.length
  const totalVolume = leaders.reduce((s, l) => s + (Number(l.volume) || 0), 0)
  const totalLuckyEntries = leaders.reduce(
    (s, l) => s + luckyEntries(l.volume, luckyOffer?.entryPer),
    0,
  )
  const qualifiedLucky = leaders.filter((l) =>
    isLuckyQualified(l.volume, luckyOffer?.threshold),
  ).length
  const qualifyingCar = leaders.filter((l) =>
    isCarQualified(l.volume, carOffer?.threshold),
  ).length

  return {
    totalLeaders,
    totalVolume,
    totalLuckyEntries,
    qualifiedLucky,
    qualifyingCar,
    qualifiedTotal: leaders.filter((l) =>
      isLuckyQualified(l.volume, luckyOffer?.threshold),
    ).length,
    activeOffers: [luckyOffer, carOffer].filter((o) => o && o.enabled).length,
  }
}

// ---------------------------------------------------------------------------
// Countdown engine
// ---------------------------------------------------------------------------
export const COUNTDOWN = {
  RUNNING: 'running',
  PAUSED: 'paused',
  ENDED: 'ended',
}

export function parseRemaining(ms) {
  const r = Math.max(0, Math.floor(Number(ms) || 0))
  return {
    days: Math.floor(r / 86400000),
    hours: Math.floor((r % 86400000) / 3600000),
    minutes: Math.floor((r % 3600000) / 60000),
    seconds: Math.floor((r % 60000) / 1000),
    ms: r,
  }
}

export function getCountdown(state, now = Date.now()) {
  const c = state?.campaign || {}
  const fields = { days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0 }

  if (c.status === COUNTDOWN.PAUSED) {
    const rem = parseRemaining(c.pausedRemainingMs)
    if (rem.ms <= 0) return { ...rem, status: COUNTDOWN.ENDED }
    return { ...rem, status: COUNTDOWN.PAUSED }
  }
  if (c.status === COUNTDOWN.ENDED) {
    return { ...fields, status: COUNTDOWN.ENDED }
  }
  const end = new Date(c.endDate).getTime()
  const rem = parseRemaining(end - now)
  if (rem.ms <= 0) return { ...fields, status: COUNTDOWN.ENDED }
  return { ...rem, status: COUNTDOWN.RUNNING }
}

// Progress toward the next lucky-draw entry.
export function luckyProgress(volume, entryPer = 2000) {
  const v = Math.max(0, Number(volume) || 0)
  const e = Math.max(1, Number(entryPer) || 2000)
  const into = v % e
  return { into, percent: (into / e) * 100, nextAt: v + (e - into) }
}

export function progressionTo(volume, threshold) {
  const v = Math.max(0, Number(volume) || 0)
  const t = Math.max(1, Number(threshold) || 1)
  return {
    percent: Math.min(100, (v / t) * 100),
    remaining: Math.max(0, t - v),
    reached: v >= t,
  }
}

export function isOfferEnabled(state, offerId) {
  return Boolean(state?.offers?.[offerId]?.enabled)
}