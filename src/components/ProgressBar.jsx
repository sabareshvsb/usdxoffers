import { motion } from 'framer-motion'

export default function ProgressBar({
  percent,
  className = '',
  height = 10,
  label = null,
  valueText = null,
}) {
  const p = Math.max(0, Math.min(100, Number(percent) || 0))
  return (
    <div className={className}>
      {(label || valueText) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-[0.18em] text-white/55">{label}</span>
          <span className="font-bold text-gold-300">{valueText}</span>
        </div>
      )}
      <div
        className="w-full overflow-hidden rounded-full bg-white/8 ring-1 ring-white/10"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${p}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative h-full rounded-full gold-bg"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent bg-[length:200%_100%] animate-shimmer" />
          <span className="absolute inset-0 rounded-full shadow-[0_0_14px_2px_rgba(232,194,68,0.6)]" />
        </motion.div>
      </div>
    </div>
  )
}