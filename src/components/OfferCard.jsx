import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CarFront, Gift, CheckCircle2, ArrowRight } from 'lucide-react'
import { fmtUSD } from '../lib/format'

function OfferVisual({ offer }) {
  const isCar = offer.id === 'tripleCar'
  if (offer.image) {
    return (
      <img
        src={offer.image}
        alt={offer.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    )
  }
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_20%,rgba(47,107,255,0.28),transparent_55%),radial-gradient(circle_at_75%_85%,rgba(212,175,55,0.3),transparent_55%),linear-gradient(160deg,#0c1a38,#04080f)]`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="grid h-20 w-20 place-items-center rounded-full glass ring-1 ring-gold-500/40 shadow-[0_0_40px_-6px_rgba(212,175,55,0.55)]"
      >
        {isCar ? (
          <CarFront className="h-10 w-10 text-gold-300" />
        ) : (
          <Gift className="h-10 w-10 text-gold-300" />
        )}
      </motion.div>
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-white/50">
        USDX-SMART
      </span>
    </div>
  )
}

export default function OfferCard({ offer, linkTo, index = 0 }) {
  const isCar = offer.id === 'tripleCar'
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group relative"
    >
      <div className="card-3d h-full">
        <span className="top-glow" />
        <div className="relative h-52 md:h-60 overflow-hidden">
          <OfferVisual offer={offer} />
          <span className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-navy-950/60 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-gold-300 backdrop-blur">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {offer.enabled ? 'Live Offer' : 'Paused'}
          </span>
          <span className="absolute bottom-4 left-5 right-5">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.34em] text-gold-300/90">
              {offer.tagline || 'Featured reward'}
            </p>
            <h3 className="font-display text-2xl font-extrabold text-white md:text-3xl">{offer.name}</h3>
          </span>
        </div>

        <div className="relative p-6">
          <p className="line-clamp-3 text-sm leading-relaxed text-white/60">
            {offer.description}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="glass rounded-xl p-3">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.24em] text-white/40">
                {isCar ? 'Qualification' : 'Entry Threshold'}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-gold-300">
                {isCar ? 'Top 3 Leaders' : fmtUSD(offer.threshold)}
              </p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.24em] text-white/40">
                {isCar ? 'Car Value' : 'Rewards Pool'}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-gold-300">
                {isCar ? offer.carValue : `${offer.totalRewards} Rewards`}
              </p>
            </div>
          </div>
          <Link
            to={linkTo}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-500/40 py-3 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-gold-200 transition-all hover:bg-gold-500/10 hover:shadow-glow-gold"
          >
            Explore Offer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}