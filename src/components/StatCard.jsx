import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, sub, accent = 'gold' }) {
  const map = {
    gold: 'text-gold-300 ring-gold-500/40 bg-gold-500/10',
    blue: 'text-royal-300 ring-royal-500/40 bg-royal-500/10',
    white: 'text-white/80 ring-white/20 bg-white/5',
  }
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="card-3d glass flex items-center gap-4 rounded-2xl p-5"
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ${map[accent] || map.gold}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl font-extrabold leading-tight text-white md:text-[1.7rem]">
          {value}
        </p>
        <p className="truncate text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/45">
          {label}
        </p>
        {sub && <p className="mt-0.5 text-xs text-gold-300/90">{sub}</p>}
      </div>
    </motion.div>
  )
}