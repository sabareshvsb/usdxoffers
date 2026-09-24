import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CarFront,
  Gift,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Ticket,
  Gem,
} from 'lucide-react'
import Countdown from '../components/Countdown'
import GoldDust from '../components/GoldDust'
import SectionHeading from '../components/SectionHeading'
import OfferCard from '../components/OfferCard'
import StatCard from '../components/StatCard'
import LeaderRankCard from '../components/LeaderRankCard'
import { useStore } from '../store/StoreContext'
import { rankLeaders, isOfferEnabled, totals } from '../lib/business'
import { fmtNum, fmtUSDCompact, fmtUSD } from '../lib/format'

export default function Home() {
  const { state } = useStore()
  const meta = state.meta
  const campaign = state.campaign
  const { sorted } = rankLeaders(state.leaders)
  const top3 = sorted.slice(0, 3)
  const t = totals(state)
  const heroSrc = meta.heroImage || '/offerheroic.png'
  const showLucky = isOfferEnabled(state, 'lucky50')
  const showCar = isOfferEnabled(state, 'tripleCar')

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroSrc}
            alt="USDX-SMART campaign banner"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/78 to-navy-950/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(212,175,55,0.18),transparent_50%)]" />
        </div>
        <GoldDust density={55} />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-28 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 rounded-full border border-gold-500/40 bg-navy-950/60 px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-gold-300 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Premium Rewards Campaign
              </span>
              <span className="flex items-center gap-2 rounded-full border border-royal-500/40 bg-navy-900/60 px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-royal-300 backdrop-blur">
                <Shield className="h-3.5 w-3.5" /> Internationally Verified
              </span>
            </div>

            <p className="font-display text-xl italic text-gold-200/90 md:text-2xl">
              {campaign.tagline}
            </p>
            <h1 className="font-display text-[clamp(3rem,10vw,7rem)] font-extrabold leading-[0.95] text-white drop-shadow-2xl">
              USDX-SMART
            </h1>

            <div className="mt-6 flex flex-wrap gap-3">
              {showLucky && (
                <span className="flex items-center gap-2 rounded-2xl glass px-5 py-3">
                  <Gem className="h-5 w-5 text-gold-300" />
                  <span>
                    <span className="block font-display text-lg font-bold text-white">LUCKY 50</span>
                    <span className="block text-[0.6rem] uppercase tracking-[0.24em] text-white/50">
                      50 Random Rewards
                    </span>
                  </span>
                </span>
              )}
              {showCar && (
                <span className="flex items-center gap-2 rounded-2xl glass px-5 py-3">
                  <CarFront className="h-5 w-5 text-gold-300" />
                  <span>
                    <span className="block font-display text-lg font-bold text-white">
                      TRIPLE CAR BONANZA
                    </span>
                    <span className="block text-[0.6rem] uppercase tracking-[0.24em] text-white/50">
                      3 Leaders · 3 Cars
                    </span>
                  </span>
                </span>
              )}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/offers" className="btn-gold">
                <Gift className="h-4 w-4" /> View Offers
              </Link>
              <Link to="/leaderboard" className="btn-ghost">
                <Trophy className="h-4 w-4" /> Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 animate-float md:block">
          <ArrowRight className="h-6 w-6 rotate-90 text-gold-300/70" />
        </div>
      </section>

      {/* ============ COUNTDOWN ============ */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.12),transparent_60%)]" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6">
          <p className="text-center font-display text-2xl font-bold text-white md:text-3xl">
            The Countdown Is On
          </p>
          <div className="divider-gold w-40" />
          <Countdown size="lg" />
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={Users} label="Total Leaders" value={fmtNum(t.totalLeaders)} accent="blue" />
          <StatCard icon={TrendingUp} label="Total Business" value={fmtUSDCompact(t.totalVolume)} sub={`${fmtUSD(t.totalVolume)} volume`} />
          <StatCard icon={Ticket} label="Lucky Draw Entries" value={fmtNum(t.totalLuckyEntries)} />
          <StatCard icon={Trophy} label="Qualified Leaders" value={fmtNum(t.qualifiedLucky)} sub="For Lucky 50" accent="blue" />
        </div>
      </section>

      {/* ============ OFFERS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <SectionHeading
          eyebrow="Featured Rewards"
          title="Two Immersive Ways to Win"
          sub="Build your direct business volume, earn lucky draw entries, and stand a chance to win from 50 premium rewards or drive away with one of three luxury cars."
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {state.offers.lucky50.enabled && (
            <OfferCard offer={state.offers.lucky50} linkTo="/lucky-50" index={0} />
          )}
          {state.offers.tripleCar.enabled && (
            <OfferCard offer={state.offers.tripleCar} linkTo="/triple-car" index={1} />
          )}
        </div>
      </section>

      {/* ============ TOP 3 PREVIEW ============ */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(47,107,255,0.12),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading
            eyebrow="Hall of Leaders"
            title="Top 3 Leaders Right Now"
            sub="Ranks are computed live from total direct business volume. Every leaderboard change in the Admin Panel reflects here instantly."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {top3.map((leader, i) => (
              <LeaderRankCard key={leader.id} leader={leader} rank={i + 1} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/leaderboard" className="btn-ghost">
              Open Full Leaderboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}