import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Timer, Trophy } from 'lucide-react'
import { COUNTDOWN, getCountdown } from '../lib/business'
import { useStore } from '../store/StoreContext'
import { pad } from '../lib/format'

function Cell({ value, label, accent = false }) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`glass grid place-items-center rounded-2xl md:rounded-3xl ${
          accent
            ? 'border-gold-500/50 shadow-[0_0_35px_-5px_rgba(212,175,55,0.5)]'
            : ''
        }`}
        style={{ width: 'clamp(4rem, 16vw, 6.5rem)', height: 'clamp(4rem, 16vw, 6.5rem)' }}
      >
        <span className="font-display text-3xl md:text-5xl font-extrabold tabular-nums text-white">
          {pad(value)}
        </span>
        <span className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-white/10" />
      </div>
      <span
        className={`mt-2 text-[0.6rem] md:text-xs font-bold uppercase tracking-[0.3em] ${
          accent ? 'text-gold-300' : 'text-royal-300/80'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

export default function Countdown({ size: _size }) {
  const { state } = useStore()
  const [cd, setCd] = useState(() => getCountdown(state))

  useEffect(() => {
    const id = setInterval(() => setCd(getCountdown(state)), 1000)
    return () => clearInterval(id)
  }, [state.campaign.status, state.campaign.endDate, state.campaign.pausedRemainingMs, state])

  if (cd.status === COUNTDOWN.ENDED) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex w-fit items-center gap-3 rounded-full px-7 py-3.5 border border-gold-500/60 bg-[radial-gradient(circle,rgba(212,175,55,0.22),rgba(5,10,24,0.7))] shadow-glow-gold"
      >
        <Trophy className="h-6 w-6 text-gold-300" />
        <span className="font-display text-xl md:text-2xl font-bold tracking-[0.18em] gold-text uppercase">
          Campaign Ended
        </span>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-gold-300/90">
        <Timer className="h-4 w-4" />
        <span className="text-[0.65rem] md:text-xs font-bold uppercase tracking-[0.34em]">
          {cd.status === COUNTDOWN.PAUSED ? 'Campaign Paused · Time Remaining' : 'Campaign Ends In'}
        </span>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Cell value={cd.days} label="Days" accent />
        <span className="pb-6 font-display text-2xl md:text-4xl font-bold text-gold-500/70 -mt-8">:</span>
        <Cell value={cd.hours} label="Hours" />
        <span className="pb-6 font-display text-2xl md:text-4xl font-bold text-gold-500/70 -mt-8">:</span>
        <Cell value={cd.minutes} label="Minutes" />
        <span className="pb-6 font-display text-2xl md:text-4xl font-bold text-gold-500/70 -mt-8">:</span>
        <Cell value={cd.seconds} label="Seconds" accent />
      </div>
    </div>
  )
}