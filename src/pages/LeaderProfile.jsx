import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Gem,
  CarFront,
  ChevronRight,
  Ticket,
  TrendingUp,
  Trophy,
  User,
  BadgeCheck,
} from 'lucide-react'
import GoldDust from '../components/GoldDust'
import ProgressBar from '../components/ProgressBar'
import StatCard from '../components/StatCard'
import { useStore } from '../store/StoreContext'
import {
  rankLeaders,
  luckyEntries,
  luckyProgress,
  progressionTo,
  isCarQualified,
  isLuckyQualified,
} from '../lib/business'
import { fmtNum, fmtUSD } from '../lib/format'

export default function LeaderProfile() {
  const { id } = useParams()
  const { state } = useStore()

  const leader = state.leaders.find((l) => l.id === id)
  if (!leader) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 pt-28 text-center">
        <User className="h-12 w-12 text-white/20" />
        <h1 className="mt-4 font-display text-3xl font-bold text-white">Leader not found</h1>
        <Link to="/leaderboard" className="btn-ghost mt-8">Back to Leaderboard</Link>
      </div>
    )
  }

  const lucky = state.offers.lucky50
  const car = state.offers.tripleCar
  const { sorted, map } = rankLeaders(state.leaders)
  const rank = map[id]
  const entries = luckyEntries(leader.volume, lucky.entryPer)
  const lp = luckyProgress(leader.volume, lucky.entryPer)
  const cp = progressionTo(leader.volume, car.threshold)
  const maxHist = Math.max(1, ...leader.history.map((h) => h.volume))

  const luckyQualified = isLuckyQualified(leader.volume, lucky.threshold)
  const carQualified = isCarQualified(leader.volume, car.threshold)
  const nextLeader = sorted[rank] && rank > 1 ? sorted[rank - 2] : null
  const rankGap = nextLeader ? Math.max(0, nextLeader.volume - leader.volume) : 0

  const milestones = [
    {
      icon: Ticket,
      label: `Next Lucky Entry`,
      percent: lp.percent,
      detail: luckyQualified
        ? `${fmtUSD(lp.nextAt - leader.volume)} more volume = next entry`
        : `${fmtUSD(leader.volume)} / ${fmtUSD(lucky.threshold)} to qualify`,
      valueText: `${fmtNum(entries)} entries`,
    },
    {
      icon: CarFront,
      label: 'Triple Car Bonanza',
      percent: cp.percent,
      detail: carQualified
        ? 'Qualified — in the race for a car'
        : `${fmtUSD(cp.remaining)} more to qualify`,
      valueText: carQualified ? 'Qualified' : `${Math.round(cp.percent)}%`,
    },
    {
      icon: Trophy,
      label: 'Next Rank',
      percent: nextLeader ? Math.min(100, (leader.volume / nextLeader.volume) * 100) : 100,
      detail: nextLeader ? `Trailing ${nextLeader.name}` : 'Top of the leaderboard',
      valueText: rankGap > 0 ? `${fmtUSD(rankGap)} behind` : 'No. 1',
    },
  ]

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.13),transparent_55%),radial-gradient(circle_at_85%_70%,rgba(47,107,255,0.12),transparent_50%)]" />
      <GoldDust density={14} />

      <section className="relative mx-auto max-w-5xl px-4 pt-32 md:px-8">
        <Link
          to="/leaderboard"
          className="mb-8 inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-white/50 transition-colors hover:text-gold-200"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Leaderboard
        </Link>

        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="card-3d glass relative overflow-hidden rounded-3xl p-7 md:p-10"
        >
          <span className="top-glow" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <span
                className={`grid h-20 w-20 place-items-center rounded-2xl font-display text-3xl font-extrabold ${
                  rank === 1 ? 'gold-bg !text-navy-950' : rank <= 3 ? 'bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/50' : 'bg-white/5 text-white/70 ring-1 ring-white/15'
                }`}
              >
                {rank}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">
                    {leader.name}
                  </h1>
                  {rank === 1 && <Trophy className="h-6 w-6 text-gold-300" />}
                </div>
                <p className="font-display text-lg text-gold-300/90">{leader.team}</p>
                <p className="mt-0.5 text-xs text-white/40">Rank #{rank} · Updated {leader.updatedAt}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {luckyQualified && (
                <span className="flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold-200">
                  <Gem className="h-4 w-4" /> Lucky 50 Eligible
                </span>
              )}
              {carQualified && (
                <span className="flex items-center gap-1.5 rounded-full border border-royal-500/40 bg-royal-500/10 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-royal-300">
                  <CarFront className="h-4 w-4" /> Car Bonanza Qualified
                </span>
              )}
            </div>
          </div>

          <div className="divider-gold my-8" />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard icon={TrendingUp} label="Business Volume" value={fmtUSD(leader.volume)} />
            <StatCard icon={Ticket} label="Lucky Entries" value={fmtNum(entries)} accent="blue" />
            <StatCard icon={Trophy} label="Current Rank" value={`#${rank}`} />
            <StatCard icon={BadgeCheck} label="Offer Status" value={carQualified ? 'Both' : luckyQualified ? 'Lucky 50' : 'Not Yet'} accent="blue" />
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-10 grid gap-6 md:grid-cols-3"
        >
          {milestones.map((m) => (
            <div key={m.label} className="card-3d glass rounded-3xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-gold-500/35 bg-gold-500/10">
                    <m.icon className="h-5 w-5 text-gold-300" />
                  </span>
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/55">{m.label}</span>
                </span>
              </div>
              <ProgressBar percent={m.percent} label={null} valueText={m.valueText} />
              <p className="mt-3 text-xs leading-relaxed text-white/45">{m.detail}</p>
            </div>
          ))}
        </motion.section>

        {/* History */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="card-3d glass mt-10 rounded-3xl p-7 md:p-9"
        >
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
              <TrendingUp className="h-5 w-5 text-gold-300" /> Recent Business Volume
            </h2>
          </div>
          <div className="mt-7 flex items-end gap-2 md:gap-3">
            {[...leader.history].reverse().map((h, i) => {
              const pct = (h.volume / maxHist) * 100
              return (
                <div key={h.date + i} className="group flex flex-1 flex-col items-center gap-2">
                  <span className="text-[0.6rem] font-bold text-gold-300 opacity-0 transition-opacity group-hover:opacity-100">
                    {fmtUSD(h.volume)}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${Math.max(6, pct)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.05 }}
                    className="w-full rounded-t-lg gold-bg shadow-[0_0_16px_-2px_rgba(232,194,68,0.5)]"
                    style={{ minHeight: 8 }}
                  />
                  <span className="text-[0.55rem] font-bold uppercase tracking-wider text-white/40">
                    {h.date.slice(5)}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <div className="glass rounded-2xl p-4">
              <p className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/45">
                <Ticket className="h-4 w-4 text-gold-300" /> Next Lucky Entry
              </p>
              <p className="mt-2 font-display text-lg font-bold text-white">
                {luckyQualified ? `${fmtUSD(lucky.entryPer - lp.into)} needed` : `${fmtUSD(lucky.threshold - leader.volume)} needed`}
              </p>
              <p className="mt-1 text-xs text-white/45">
                {luckyQualified
                  ? `One more entry at ${fmtUSD(lp.nextAt)} volume`
                  : 'Qualify to begin earning entries'}
              </p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/45">
                <CarFront className="h-4 w-4 text-royal-300" /> Car Milestone
              </p>
              <p className="mt-2 font-display text-lg font-bold text-white">
                {carQualified ? 'Qualified' : `${fmtUSD(cp.remaining)} to qualify`}
              </p>
              <p className="mt-1 text-xs text-white/45">
                {carQualified ? 'Direct volume threshold reached' : `Threshold: ${fmtUSD(car.threshold)}`}
              </p>
            </div>
          </div>
        </motion.section>

        <div className="py-12 text-center">
          <Link to="/leaderboard" className="btn-gold">
            Explore the Leaderboard <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}