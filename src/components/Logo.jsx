import { motion } from 'framer-motion'

export default function Logo({ size = 44, withText = true, className = '' }) {
  return (
    <a
      href="#/"
      className={`flex items-center gap-3 select-none ${className}`}
      aria-label="USDX-SMART home"
    >
      <motion.span
        whileHover={{ rotate: 4, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="relative grid place-items-center rounded-xl gold-bg shadow-[0_10px_30px_-8px_rgba(212,175,55,0.7)]"
        style={{ width: size, height: size }}
      >
        <span className="font-display font-extrabold text-navy-950" style={{ fontSize: size * 0.5 }}>
          U
        </span>
        <span className="absolute inset-0 rounded-xl ring-1 ring-white/40" />
      </motion.span>
      {withText && (
        <span className="leading-none">
          <span className="gold-text block font-display font-extrabold tracking-[0.08em]" style={{ fontSize: size * 0.42 }}>
            USDX-SMART
          </span>
          <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.42em] text-royal-300/80 mt-1">
            Rewards Campaign
          </span>
        </span>
      )}
    </a>
  )
}