import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Gem, CarFront, ChevronRight, User } from 'lucide-react'
import { fmtUSD } from '../lib/format'
import { isLuckyQualified, isCarQualified, luckyEntries } from '../lib/business'
import { useStore } from '../store/StoreContext'

const rankStyles = {
  1: {
    ring: 'from-gold-300 via-gold-500 to-gold-700',
    badge: 'bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.4),rgba(5,10,24,0.9))]',
    chip: 'text-gold-200 border-gold-500/50',
  },
  2: {
    ring: 'from-slate-200 via-slate-400 to-slate-600',
    badge: 'bg-[radial-gradient(circle_at_30%_20%,rgba(200,210,225,0.35),rgba(5,10,24,0.9))]',
    chip: 'text-slate-200 border-slate-400/50',
  },
  3: {
    ring: 'from-amber-500 via-amber-700 to-amber-900',
    badge: 'bg-[radial-gradient(circle_at_30%_20%,rgba(180,120,40,0.35),rgba(5,10,24,0.9))]',
    chip: 'text-amber-300 border-amber-600/50',
  },
}

export default function LeaderRankCard({ leader, rank, delay = 0 }) {
  const { state } = useStore()
  const lucky = state.offers.lucky50
  const car = state.offers.tripleCar
  const style = rankStyles[rank] || rankStyles[3]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay }}
      className={`card-3d relative rounded-3xl p-6 md:p-7 ${rank === 1 ? 'md:-mt-6 md:scale-[1.03]' : ''}`}
    >
      <span className="top-glow" />
      {rank === 1 && (
        <div className="absolute right-5 top-5">
          <Crown className="h-7 w-7 text-gold-300 animate-pulse-soft" />
        </div>
      )}

      <div
        className={`mb-5 inline-grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br p-[2px] ${style.ring}`}
      >
        <span className="grid h-full w-full place-items-center rounded-[calc(1rem-2px)] bg-navy-900 font-display text-2xl font-extrabold text-white">
          {rank}
        </span>
      </div>

      <h3 className="font-display text-2xl font-bold text-white">{leader.name}</h3>
      <p className="font-display text-sm text-gold-300/90">{leader.team}</p>

      <div className="mt-5 flex items-center justify-between rounded-2xl glass px-4 py-3">
        <span className="text-[0.58rem] font-bold uppercase tracking-[0.24em] text-white/45">
          Business Volume
        </span>
        <span className="font-display text-2xl font-extrabold gold-text">{fmtUSD(leader.volume)}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] ${style.chip}`}
        >
          <Gem className="h-3.5 w-3.5" /> {luckyEntries(leader.volume, lucky.entryPer)} Entries
        </span>
        {isCarQualified(leader.volume, car.threshold) && (
          <span className="flex items-center gap-1.5 rounded-full border border-royal-500/50 bg-royal-500/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-royal-300">
            <CarFront className="h-3.5 w-3.5" /> Car Qualified
          </span>
        )}
        {isLuckyQualified(leader.volume, lucky.threshold) && (
          <span className="flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold-200">
            <User className="h-3.5 w-3.5" /> Lucky 50
          </span>
        )}
      </div>

      <Link
        to={`/leader/${leader.id}`}
        className="mt-6 flex items-center justify-center gap-1.5 rounded-full border border-gold-500/35 py-3 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold-200 transition-all hover:bg-gold-500/10 hover:shadow-glow-gold"
      >
        View Profile <ChevronRight className="h-4 w-4" />
      </Link>
    </motion.div>
  )
}