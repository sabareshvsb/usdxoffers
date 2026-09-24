import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  Ticket,
  Trophy,
  Timer,
  Gift,
  ArrowRight,
  CalendarClock,
  PieChart,
  Activity,
} from 'lucide-react'
import StatCard from '../../components/StatCard'
import GoldDust from '../../components/GoldDust'
import { useStore } from '../../store/StoreContext'
import { totals, getCountdown, COUNTDOWN } from '../../lib/business'
import { fmtNum, fmtUSD, fmtDate, fmtUSDCompact } from '../../lib/format'

const TIERS = [
  { label: '$0 – $2,000', min: 0, max: 2000 },
  { label: '$2,000 – $5,000', min: 2000, max: 5000 },
  { label: '$5,000 – $10,000', min: 5000, max: 10000 },
  { label: '$10,000 – $20,000', min: 10000, max: 20000 },
  { label: '$20,000 – $30,000', min: 20000, max: 30000 },
  { label: '$30,000+', min: 30000, max: Infinity },
]

export default function AdminDashboard() {
  const { state } = useStore()
  const t = totals(state)
  const cd = getCountdown(state)
  const campaignEnd = state.campaign.status === COUNTDOWN.RUNNING
    ? (cd.days * 86400 + cd.hours * 3600 + cd.minutes * 60 + cd.seconds) / 86400
    : 0
  const statusColor =
    state.campaign.status === COUNTDOWN.RUNNING
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
      : state.campaign.status === COUNTDOWN.PAUSED
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
        : 'border-red-500/40 bg-red-500/10 text-red-300'

  const tierData = TIERS.map((tier) => {
    const count = state.leaders.filter(
      (l) => l.volume >= tier.min && (tier.max === Infinity ? true : l.volume < tier.max),
    ).length
    const pct = state.leaders.length ? (count / state.leaders.length) * 100 : 0
    return { ...tier, count, pct }
  })

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(212,175,55,0.1),transparent_50%)]" />
      <GoldDust density={10} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">Campaign Dashboard</h1>
          <p className="mt-1 text-sm text-white/45">Live overview of the USDX-SMART rewards campaign.</p>
        </div>
        <span className={`flex items-center gap-2 rounded-full border px-5 py-2 text-[0.66rem] font-bold uppercase tracking-[0.22em] ${statusColor}`}>
          <Activity className="h-4 w-4" />
          {state.campaign.status}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-3">
        <StatCard icon={Users} label="Total Leaders" value={fmtNum(t.totalLeaders)} accent="blue" />
        <StatCard icon={TrendingUp} label="Total Business Volume" value={fmtUSDCompact(t.totalVolume)} sub={fmtUSD(t.totalVolume)} />
        <StatCard icon={Ticket} label="Lucky Draw Entries" value={fmtNum(t.totalLuckyEntries)} />
        <StatCard icon={Trophy} label="Qualified Leaders" value={fmtNum(t.qualifiedTotal)} sub={`${t.qualifyingCar} for cars`} accent="blue" />
        <StatCard
          icon={Timer}
          label="Campaign Days Remaining"
          value={cd.status === COUNTDOWN.ENDED ? '0' : fmtNum(campaignEnd)}
          sub={cd.status}
        />
        <StatCard icon={Gift} label="Active Offers" value={`${t.activeOffers}/2`} accent="blue" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-5">
        {/* Volume distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d glass rounded-3xl p-7 xl:col-span-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
              <PieChart className="h-5 w-5 text-gold-300" /> Leaders by Volume Band
            </h2>
          </div>
          <div className="mt-7 space-y-4">
            {tierData.map((tier, i) => (
              <div key={tier.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-[0.14em] text-white/55">{tier.label}</span>
                  <span className="font-bold text-gold-300">
                    {tier.count} leader{tier.count === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/8 ring-1 ring-white/10">
                  <div
                    className="h-full rounded-full gold-bg"
                    style={{ width: `${tier.pct}%`, transition: 'width 0.9s ease', transitionDelay: `${i * 0.06}s` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Offer + schedule summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-3d glass rounded-3xl p-7 xl:col-span-2"
        >
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <CalendarClock className="h-5 w-5 text-gold-300" /> Campaign Schedule
          </h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="glass flex items-center justify-between rounded-xl px-4 py-3">
              <span className="text-white/45">Starts</span>
              <span className="font-bold text-white">{fmtDate(state.campaign.startDate)}</span>
            </div>
            <div className="glass flex items-center justify-between rounded-xl px-4 py-3">
              <span className="text-white/45">Ends</span>
              <span className="font-bold text-white">{fmtDate(state.campaign.endDate)}</span>
            </div>
            <div className="glass flex items-center justify-between rounded-xl px-4 py-3">
              <span className="text-white/45">Countdown</span>
              <span className="font-bold text-gold-300">
                {cd.days}d {cd.hours}h {cd.minutes}m {cd.seconds}s
              </span>
            </div>
          </div>

          <h2 className="mt-8 flex items-center gap-2 font-display text-xl font-bold text-white">
            <Gift className="h-5 w-5 text-gold-300" /> Offer Snapshots
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[state.offers.lucky50, state.offers.tripleCar].map((o) => (
              <div key={o.id} className="glass rounded-2xl p-4">
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-white/40">Status</p>
                <p className={`mt-0.5 font-display text-lg font-bold ${o.enabled ? 'text-emerald-300' : 'text-red-400'}`}>
                  {o.enabled ? 'Live' : 'Paused'}
                </p>
                <p className="mt-1 truncate text-[0.62rem] uppercase tracking-[0.12em] text-white/45">{o.name}</p>
              </div>
            ))}
          </div>

          <Link to="/admin/campaign" className="btn-ghost mt-7 w-full !py-3 !text-[0.68rem]">
            Configure Campaign <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-3d glass mt-6 rounded-3xl p-7"
      >
        <h2 className="font-display text-xl font-bold text-white">Quick Actions</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link to="/admin/leaders" className="group flex items-center justify-between rounded-2xl border border-gold-500/30 bg-white/3 px-5 py-4 transition-all hover:bg-gold-500/10">
            <span>
              <span className="block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/45">Manage</span>
              <span className="font-display text-lg font-bold text-white">Leaderboard</span>
            </span>
            <ArrowRight className="h-5 w-5 text-gold-300 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/admin/offers" className="group flex items-center justify-between rounded-2xl border border-gold-500/30 bg-white/3 px-5 py-4 transition-all hover:bg-gold-500/10">
            <span>
              <span className="block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/45">Edit</span>
              <span className="font-display text-lg font-bold text-white">Offers & Rewards</span>
            </span>
            <ArrowRight className="h-5 w-5 text-gold-300 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/admin/campaign" className="group flex items-center justify-between rounded-2xl border border-gold-500/30 bg-white/3 px-5 py-4 transition-all hover:bg-gold-500/10">
            <span>
              <span className="block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/45">Control</span>
              <span className="font-display text-lg font-bold text-white">Countdown</span>
            </span>
            <ArrowRight className="h-5 w-5 text-gold-300 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}