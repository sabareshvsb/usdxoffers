import { motion } from 'framer-motion'

export default function SectionHeading({ eyebrow, title, sub, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`${center ? 'mx-auto text-center' : 'text-left'}`}
    >
      {eyebrow && (
        <div
          className={`mb-4 flex items-center gap-3 ${center ? 'justify-center' : ''}`}
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/70" />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-gold-300">
            {eyebrow}
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/70" />
        </div>
      )}
      <h2 className="font-display text-3xl font-extrabold leading-tight text-white md:text-5xl">
        {title}
      </h2>
      {sub && <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">{sub}</p>}
    </motion.div>
  )
}