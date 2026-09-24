import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CarFront,
  Crown,
  Trophy,
  Users,
  CalendarDays,
  Timer,
  ArrowRight,
  Sparkles,
  MapPin,
} from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import GoldDust from '../components/GoldDust'
import Countdown from '../components/Countdown'
import LeaderRankCard from '../components/LeaderRankCard'
import StatCard from '../components/StatCard'
import { useStore } from '../store/StoreContext'
import { rankLeaders, isCarQualified, getCountdown, COUNTDOWN } from '../lib/business'
import { fmtDate, fmtNum, fmtUSD } from '../lib/format'

function CarVisual({ car, index, img }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="card-3d group relative h-72 overflow-hidden rounded-3xl"
    >
      <span className="top-glow" />
      {img ? (
        <img src={img} alt={car.label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_30%_15%,rgba(47,107,255,0.3),transparent_55%),radial-gradient(circle_at_75%_80%,rgba(212,175,55,0.28),transparent_55%),linear-gradient(165deg,#0c1a38,#04080f)]">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
          >
            <CarFront className="h-24 w-24 text-gold-300 drop-shadow-[0_0_30px_rgba(232,194,68,0.7)]" />
          </motion.div>
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-white/45">
            Premium <span className="text-gold-300">{car.label}</span>
          </span>
        </div>
      )}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 to-transparent p-5 pt-16">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-gold-300">Car {index + 1}</span>
        <p className="font-display text-2xl font-bold text-white">{car.label}</p>
      </span>
    </motion.div>
  )
}

export default function TripleCar() {
  const { state } = useStore()
  const offer = state.offers.tripleCar
  const { sorted } = rankLeaders(state.leaders)
  const top3 = sorted.filter((l) => isCarQualified(l.volume, offer.threshold)).slice(0, 3)
  const cd = getCountdown(state)

  if (!offer.enabled) {
    return (
      <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 pt-28 text-center">
        <CarFront className="h-12 w-12 text-white/20" />
        <h1 className="mt-4 font-display text-3xl font-bold text-white">TRIPLE CAR BONANZA is paused</h1>
        <p className="mt-3 text-white/55">The campaign team has temporarily disabled this offer.</p>
        <Link to="/offers" className="btn-ghost mt-8">Back to Offers</Link>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(47,107,255,0.16),transparent_55%),radial-gradient(circle_at_10%_70%,rgba(212,175,55,0.12),transparent_50%)]" />
      <GoldDust density={18} />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pt-32 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-royal-500/40 bg-royal-500/10 px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-royal-300">
              <Crown className="h-3.5 w-3.5" /> Grand Reward
            </span>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-tight text-white md:text-7xl">
              TRIPLE CAR <span className="gold-text">BONANZA</span>
            </h1>
            <p className="mt-2 font-display text-xl italic text-royal-200">{offer.tagline}</p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/60 md:text-base">
              {offer.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/leaderboard" className="btn-gold">
                <Trophy className="h-4 w-4" /> See Qualifying Leaders
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="card-3d glass rounded-3xl p-7"
          >
            <div className="flex items-center justify-between">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.26em] text-white/45">Campaign Clock</p>
              <span className="rounded-full border border-royal-500/40 bg-royal-500/10 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-royal-300">
                {cd.status === COUNTDOWN.ENDED ? 'Ended' : `Top ${offer.topN} Win`}
              </span>
            </div>
            <div className="my-7 flex justify-center">
              <Countdown size="md" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="glass flex items-center justify-between rounded-xl px-4 py-3">
                <span className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/45">
                  <Users className="h-4 w-4 text-royal-300" /> Qualifying Leaders
                </span>
                <span className="font-display text-xl font-bold text-white">Top {offer.topN}</span>
              </div>
              <div className="glass flex items-center justify-between rounded-xl px-4 py-3">
                <span className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/45">
                  <CarFront className="h-4 w-4 text-gold-300" /> Cars Awarded
                </span>
                <span className="font-display text-xl font-bold gold-text">{offer.carValue}</span>
              </div>
              <div className="glass flex items-center justify-between rounded-xl px-4 py-3">
                <span className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/45">
                  <MapPin className="h-4 w-4 text-royal-300" /> Campaign Duration
                </span>
                <span className="text-xs font-bold text-white">
                  {fmtDate(offer.startDate)} → {fmtDate(offer.endDate)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={CarFront} label="Car Value" value={offer.carValue} accent="blue" />
          <StatCard icon={Users} label="Qualifying Target" value={`Top ${offer.topN}`} />
          <StatCard icon={Timer} label="Days Remaining" value={cd.status === COUNTDOWN.ENDED ? '0' : cd.days} accent="blue" sub={cd.status} />
          <StatCard icon={CalendarDays} label="Campaign Closes" value={fmtDate(offer.endDate)} />
        </div>
      </section>

      {/* Cars */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <SectionHeading
          eyebrow="The Prizes"
          title="Three Luxury Cars Await"
          sub="One premium automobile for each of the top three qualifying leaders — valued between ₹15–20 Lakhs."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {offer.rewards.map((car, i) => (
            <CarVisual key={car.label + i} car={car} index={i} img={offer.image} />
          ))}
        </div>

        {/* Threshold strip */}
        <div className="mt-12">
          <div className="card-3d relative overflow-hidden rounded-3xl p-8 text-center md:p-10">
            <span className="top-glow" />
            <Sparkles className="mx-auto h-8 w-8 text-gold-300" />
            <h3 className="mt-4 font-display text-2xl font-bold text-white md:text-3xl">
              Reach {fmtUSD(offer.threshold)} Direct Business Volume
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/55">
              The three leaders with the highest direct business volume — at or above the threshold — at campaign close take the cars.
            </p>
          </div>
        </div>
      </section>

      {/* Current leaders in the running */}
      {top3.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <SectionHeading
            eyebrow="Currently Qualifying"
            title={`${fmtNum(top3.length)} Leader${top3.length === 1 ? '' : 's'} in the Race`}
            sub="These leaders are currently at or above the qualification threshold."
          />
          <div className="mt-12 grid items-start gap-6 md:grid-cols-3">
            {top3.map((leader, i) => (
              <LeaderRankCard key={leader.id} leader={leader} rank={i + 1} delay={i * 0.12} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/leaderboard" className="btn-gold">
              Full Leaderboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}