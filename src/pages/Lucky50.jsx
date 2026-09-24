import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Gem,
  Gift,
  Ticket,
  Target,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trophy,
} from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import GoldDust from '../components/GoldDust'
import Countdown from '../components/Countdown'
import RewardIcon from '../components/RewardIcon'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'
import { useStore } from '../store/StoreContext'
import {
  rankLeaders,
  isLuckyQualified,
  luckyEntries,
  totals,
} from '../lib/business'
import { fmtNum, fmtUSD } from '../lib/format'

export default function Lucky50() {
  const { state } = useStore()
  const offer = state.offers.lucky50
  const { sorted } = rankLeaders(state.leaders)
  const qualified = sorted.filter((l) => isLuckyQualified(l.volume, offer.threshold))
  const t = totals(state)

  if (!offer.enabled) {
    return (
      <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 pt-28 text-center">
        <Gift className="h-12 w-12 text-white/20" />
        <h1 className="mt-4 font-display text-3xl font-bold text-white">LUCKY 50 is paused</h1>
        <p className="mt-3 text-white/55">The campaign team has temporarily disabled this offer.</p>
        <Link to="/offers" className="btn-ghost mt-8">Back to Offers</Link>
      </div>
    )
  }

  const steps = [
    {
      icon: Target,
      title: `Reach ${fmtUSD(offer.threshold)}`,
      text: `Build a minimum direct business volume of ${fmtUSD(offer.threshold)} to become eligible.`,
    },
    {
      icon: Ticket,
      title: 'Earn Draw Entries',
      text: `Receive 1 lucky draw entry for every ${fmtUSD(offer.entryPer)} of business volume.`,
    },
    {
      icon: Gem,
      title: 'Win From 50 Rewards',
      text: `${offer.totalRewards} premium rewards will be drawn live among the first ${offer.totalRewards} eligible leaders.`,
    },
  ]

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(212,175,55,0.14),transparent_55%),radial-gradient(circle_at_85%_60%,rgba(47,107,255,0.12),transparent_50%)]" />
      <GoldDust density={18} />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pt-32 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-gold-300">
              <Sparkles className="h-3.5 w-3.5" /> Flagship Offer
            </span>
            <h1 className="mt-5 font-display text-5xl font-extrabold text-white md:text-7xl">
              LUCKY <span className="gold-text">50</span>
            </h1>
            <p className="mt-2 font-display text-xl italic text-royal-200">
              {offer.tagline}
            </p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/60 md:text-base">
              {offer.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/leaderboard" className="btn-gold">
                <Trophy className="h-4 w-4" /> Qualified Leaders
              </Link>
              <Link to="/offers" className="btn-ghost">
                <Gem className="h-4 w-4" /> All Offers
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
              <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-gold-300">
                {offer.totalRewards} Rewards
              </span>
            </div>
            <div className="my-7 flex justify-center">
              <Countdown size="md" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.24em] text-white/40">Min. Volume</p>
                <p className="mt-1 font-display text-2xl font-bold gold-text">{fmtUSD(offer.threshold)}</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.24em] text-white/40">Entry Every</p>
                <p className="mt-1 font-display text-2xl font-bold gold-text">{fmtUSD(offer.entryPer)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={Gift} label="Total Rewards" value={offer.totalRewards} />
          <StatCard icon={Ticket} label="Total Entries" value={fmtNum(t.totalLuckyEntries)} accent="blue" />
          <StatCard icon={Users} label="Qualified Leaders" value={fmtNum(qualified.length)} />
          <StatCard icon={Trophy} label="Leaders Advancing" value={fmtNum(qualified.length)} accent="blue" />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading eyebrow="How It Works" title="Three Steps to a Lucky Draw" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="card-3d glass relative rounded-3xl p-7 text-center"
            >
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full gold-bg px-4 py-1 font-display text-sm font-extrabold text-navy-950">
                {i + 1}
              </span>
              <span className="mx-auto mt-4 grid h-14 w-14 place-items-center rounded-2xl border border-gold-500/40 bg-gold-500/10">
                <s.icon className="h-7 w-7 text-gold-300" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rewards */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <SectionHeading
          eyebrow="Reward Pool"
          title={`${offer.totalRewards} Premium Rewards`}
          sub="Smartphones, tablets, smart watches, washing machines, LED televisions and refrigerators — allocated at random among lucky draw winners."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {offer.rewards.map((r, i) => (
            <motion.div
              key={r.label + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="card-3d glass group rounded-2xl p-6 text-center"
            >
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-xl border border-gold-500/35 bg-gold-500/10 transition-transform duration-300 group-hover:scale-110">
                <RewardIcon label={r.label} className="h-8 w-8 text-gold-300" />
              </span>
              <p className="mt-4 font-display text-lg font-bold text-white">{r.label}</p>
              <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-gold-300">
                {r.count} Reward{r.count === 1 ? '' : 's'}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Qualified preview */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <SectionHeading
          eyebrow="Qualified Candidates"
          title={`${qualified.length} Eligible Leader${qualified.length === 1 ? '' : 's'} & Counting`}
        />
        <div className="mt-10 space-y-3">
          {qualified.slice(0, 8).map((l, i) => {
            const entries = luckyEntries(l.volume, offer.entryPer)
            const maxEntries = Math.max(1, ...qualified.map((x) => luckyEntries(x.volume, offer.entryPer)))
            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass flex items-center gap-4 rounded-2xl p-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500/15 font-display font-extrabold text-gold-300">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <Link to={`/leader/${l.id}`} className="truncate font-display text-base font-bold text-white hover:text-gold-200">
                      {l.name}
                    </Link>
                    <span className="shrink-0 text-xs font-bold text-gold-200">
                      {fmtNum(entries)} entries
                    </span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar
                      percent={(entries / maxEntries) * 100}
                      height={7}
                      valueText={`${fmtUSD(l.volume)} volume`}
                    />
                  </div>
                </div>
                <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-gold-500/35 bg-gold-500/10 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-gold-200 sm:flex">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Eligible
                </span>
              </motion.div>
            )
          })}
        </div>
        <div className="mt-10 text-center">
          <Link to="/leaderboard" className="btn-gold">
            View Full Leaderboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}