import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Gem,
  Trophy,
  TrendingUp,
  CarFront,
  Users,
} from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import LeaderRankCard from '../components/LeaderRankCard'
import GoldDust from '../components/GoldDust'
import { useStore } from '../store/StoreContext'
import { rankLeaders, luckyEntries, isCarQualified, isLuckyQualified } from '../lib/business'
import { fmtNum, fmtUSD } from '../lib/format'

const SORTS = [
  { key: 'rank', label: 'Rank' },
  { key: 'volume', label: 'Volume' },
  { key: 'entries', label: 'Entries' },
  { key: 'name', label: 'Name' },
  { key: 'updated', label: 'Last Updated' },
]

const offersFilter = [
  { key: 'all', label: 'All Offers' },
  { key: 'lucky50', label: 'Lucky 50' },
  { key: 'tripleCar', label: 'Triple Car' },
]

function MobileCard({ leader, rank }) {
  const { state } = useStore()
  const lucky = state.offers.lucky50
  const car = state.offers.tripleCar
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="card-3d glass p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-11 w-11 place-items-center rounded-xl font-display text-lg font-extrabold text-white ${
              rank === 1 ? 'gold-bg !text-navy-950' : rank <= 3 ? 'bg-gold-500/20 text-gold-300' : 'bg-white/5 text-white/60'
            }`}
          >
            {rank}
          </span>
          <div>
            <Link to={`/leader/${leader.id}`} className="font-display text-lg font-bold text-white hover:text-gold-200">
              {leader.name}
            </Link>
            <p className="text-xs text-white/45">{leader.team}</p>
          </div>
        </div>
        {rank === 1 && <Trophy className="h-5 w-5 text-gold-300" />}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="glass rounded-xl p-2.5">
          <p className="font-display text-base font-bold gold-text">{fmtUSD(leader.volume)}</p>
          <p className="text-[0.55rem] uppercase tracking-[0.2em] text-white/40">Volume</p>
        </div>
        <div className="glass rounded-xl p-2.5">
          <p className="font-display text-base font-bold text-white">{fmtNum(luckyEntries(leader.volume, lucky.entryPer))}</p>
          <p className="text-[0.55rem] uppercase tracking-[0.2em] text-white/40">Entries</p>
        </div>
        <div className="glass rounded-xl p-2.5">
          <p className="font-display text-base font-bold text-royal-300">
            {isCarQualified(leader.volume, car.threshold) ? 'Yes' : isLuckyQualified(leader.volume, lucky.threshold) ? 'In' : '—'}
          </p>
          <p className="text-[0.55rem] uppercase tracking-[0.2em] text-white/40">Offer</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.18em] text-white/40">
        <span>Updated {leader.updatedAt}</span>
        <Link to={`/leader/${leader.id}`} className="flex items-center gap-1 text-gold-300">
          Profile <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  )
}

export default function Leaderboard() {
  const { state } = useStore()
  const leaders = state.leaders
  const lucky = state.offers.lucky50
  const pageSize = state.settings.leaderboardPageSize || 8

  const { sorted, map: rankMap } = useMemo(() => rankLeaders(leaders), [leaders])
  const top3 = sorted.slice(0, 3)

  const [query, setQuery] = useState('')
  const [offer, setOffer] = useState('all')
  const [sort, setSort] = useState('rank')
  const [dir, setDir] = useState(-1)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let rows = sorted.slice()
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      rows = rows.filter(
        (l) => l.name.toLowerCase().includes(q) || l.team.toLowerCase().includes(q),
      )
    }
    if (offer !== 'all') {
      rows = rows.filter((l) => (l.currentOffer || 'lucky50').split(',').includes(offer))
    }
    const entry = (l) => luckyEntries(l.volume, lucky.entryPer)
    const sorters = {
      rank: (a, b) => rankMap[a.id] - rankMap[b.id],
      volume: (a, b) => a.volume - b.volume,
      entries: (a, b) => entry(a) - entry(b),
      name: (a, b) => a.name.localeCompare(b.name),
      updated: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    }
    rows.sort(sorters[sort])
    if (dir === 1) rows.reverse()
    if (sort === 'rank') rows.sort((a, b) => rankMap[a.id] - rankMap[b.id])
    return rows
  }, [sorted, query, offer, sort, dir, rankMap, lucky.entryPer])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pages)
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const toggleDir = (key) => {
    if (sort === key) setDir((d) => d * -1)
    else {
      setSort(key)
      setDir(key === 'name' ? 1 : -1)
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(47,107,255,0.13),transparent_55%),radial-gradient(circle_at_10%_60%,rgba(212,175,55,0.1),transparent_50%)]" />
      <GoldDust density={16} />

      <section className="relative mx-auto max-w-7xl px-4 pt-32 md:px-8">
        <SectionHeading
          eyebrow="Live Rankings"
          title="Campaign Leaderboard"
          sub="Real-time standings by total direct business volume. All data is editable from the Admin Panel and reflects instantly."
        />
      </section>

      {/* Top 3 */}
      <section className="relative mx-auto mt-14 max-w-7xl px-4 md:px-8">
        <div className="grid gap-6 md:grid-cols-3 items-start">
          {top3.map((leader, i) => (
            <LeaderRankCard key={leader.id} leader={leader} rank={i + 1} delay={i * 0.12} />
          ))}
        </div>
      </section>

      {/* Controls + table */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="card-3d glass rounded-3xl p-5 md:p-7">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-300/70" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder="Search leader or team..."
                className="input-lux !pl-11"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/40 md:flex">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
              </span>
              <div className="flex rounded-full border border-gold-500/25 bg-white/5 p-1">
                {offersFilter.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => {
                      setOffer(f.key)
                      setPage(1)
                    }}
                    className={`rounded-full px-4 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.16em] transition-colors ${
                      offer === f.key ? 'gold-bg !text-navy-950' : 'text-white/55 hover:text-gold-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => toggleDir(s.key)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] transition-colors ${
                  sort === s.key
                    ? 'border-gold-500/60 bg-gold-500/10 text-gold-300'
                    : 'border-white/10 text-white/45 hover:text-gold-200'
                }`}
              >
                <ArrowUpDown className="h-3 w-3" />
                {s.label}
                {sort === s.key && <span className="text-gold-300">{dir === 1 ? '↑' : '↓'}</span>}
              </button>
            ))}
          </div>

          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[820px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left">
                  {[
                    ['Rank', 'w-20'],
                    ['Leader Name', ''],
                    ['Team', ''],
                    ['Total Business Volume', 'text-right'],
                    ['Lucky Draw Entries', 'text-center'],
                    ['Current Offer', ''],
                    ['Last Updated', 'text-right'],
                  ].map(([label, align], i) => (
                    <th
                      key={i}
                      className={`border-b border-gold-500/25 pb-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-gold-300/90 ${align}`}
                    >
                      {label}
                    </th>
                  ))}
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {rows.map((leader) => {
                    const rank = rankMap[leader.id]
                    const entry = luckyEntries(leader.volume, lucky.entryPer)
                    return (
                      <motion.tr
                        key={leader.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group"
                      >
                        <td className="border-b border-white/5 py-3.5">
                          <span
                            className={`inline-grid h-9 w-9 place-items-center rounded-lg font-display font-extrabold ${
                              rank === 1
                                ? 'gold-bg !text-navy-950'
                                : rank === 2
                                  ? 'bg-slate-400/25 text-slate-200'
                                  : rank === 3
                                    ? 'bg-amber-600/25 text-amber-300'
                                    : 'bg-white/5 text-white/50'
                            }`}
                          >
                            {rank}
                          </span>
                        </td>
                        <td className="border-b border-white/5 py-3.5">
                          <Link to={`/leader/${leader.id}`} className="font-display text-base font-bold text-white hover:text-gold-200">
                            {leader.name}
                          </Link>
                        </td>
                        <td className="border-b border-white/5 py-3.5 text-sm text-white/50">{leader.team}</td>
                        <td className="border-b border-white/5 py-3.5 text-right font-display text-base font-bold gold-text">
                          {fmtUSD(leader.volume)}
                        </td>
                        <td className="border-b border-white/5 py-3.5 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-200">
                            <Gem className="h-3 w-3" /> {fmtNum(entry)}
                          </span>
                        </td>
                        <td className="border-b border-white/5 py-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] ${
                              (leader.currentOffer || '').includes('tripleCar')
                                ? 'bg-royal-500/15 text-royal-300 border border-royal-500/40'
                                : 'bg-gold-500/10 text-gold-200 border border-gold-500/30'
                            }`}
                          >
                            {(leader.currentOffer || 'lucky50').includes('tripleCar') ? (
                              <CarFront className="h-3 w-3" />
                            ) : (
                              <Gem className="h-3 w-3" />
                            )}
                            {(leader.currentOffer || 'lucky50').includes('tripleCar')
                              ? 'Triple Car'
                              : 'Lucky 50'}
                          </span>
                        </td>
                        <td className="border-b border-white/5 py-3.5 text-right text-xs text-white/40">
                          {leader.updatedAt}
                        </td>
                        <td className="border-b border-white/5 py-3.5">
                          <Link
                            to={`/leader/${leader.id}`}
                            className="grid h-8 w-8 place-items-center rounded-full border border-gold-500/30 text-gold-300 transition-all group-hover:bg-gold-500/10"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 space-y-4 md:hidden">
            {rows.map((leader) => (
              <MobileCard key={leader.id} leader={leader} rank={rankMap[leader.id]} />
            ))}
          </div>

          {rows.length === 0 && (
            <div className="py-16 text-center">
              <Users className="mx-auto h-10 w-10 text-white/20" />
              <p className="mt-3 text-sm text-white/45">No leaders match your search.</p>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-7 flex items-center justify-between border-t border-white/5 pt-5">
              <p className="text-xs text-white/40">
                Showing{' '}
                <span className="text-gold-300">{(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}</span>{' '}
                of <span className="text-white">{filtered.length}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-gold-500/30 text-gold-300 disabled:opacity-30 transition-colors hover:bg-gold-500/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === pages || Math.abs(n - safePage) <= 1)
                  .reduce((acc, n, idx, arr) => {
                    if (idx > 0 && n - arr[idx - 1] > 1) acc.push(<span key={`e${n}`} className="px-1 text-white/30">…</span>)
                    acc.push(
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition-colors ${
                          n === safePage ? 'gold-bg !text-navy-950' : 'text-white/55 hover:bg-gold-500/10'
                        }`}
                      >
                        {n}
                      </button>,
                    )
                    return acc
                  }, [])}
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={safePage >= pages}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-gold-500/30 text-gold-300 disabled:opacity-30 transition-colors hover:bg-gold-500/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/" className="btn-ghost">
            <TrendingUp className="h-4 w-4" /> Back Home
          </Link>
        </div>
      </section>
    </div>
  )
}