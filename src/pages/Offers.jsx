import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import OfferCard from '../components/OfferCard'
import GoldDust from '../components/GoldDust'
import Countdown from '../components/Countdown'
import { useStore } from '../store/StoreContext'

export default function Offers() {
  const { state } = useStore()
  const offers = [state.offers.lucky50, state.offers.tripleCar].filter((o) => o.enabled)
  const paused = [state.offers.lucky50, state.offers.tripleCar].filter((o) => !o.enabled)

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(212,175,55,0.12),transparent_55%)]" />
      <GoldDust density={14} />

      <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-32 text-center md:px-8">
        <SectionHeading
          eyebrow="Rewards Portfolio"
          title="Explore the Campaign Offers"
          sub="Two flagship reward programs under the USDX-SMART umbrella. Every detail below is live and configurable from the Admin Panel."
        />
        <div className="mt-10 flex justify-center">
          <Countdown size="md" />
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          {offers.map((o) => (
            <OfferCard
              key={o.id}
              offer={o}
              linkTo={o.id === 'tripleCar' ? '/triple-car' : '/lucky-50'}
              index={0}
            />
          ))}
        </div>
        {paused.length > 0 && (
          <div className="mt-10 rounded-2xl glass p-6 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-gold-300" />
            <p className="mt-2 text-sm text-white/55">
              {paused.map((o) => o.name).join(' & ')} is currently paused by the campaign team.
            </p>
          </div>
        )}
        <div className="mt-14 text-center">
          <Link to="/leaderboard" className="btn-gold">
            <ArrowRight className="h-4 w-4" /> See Who's Winning
          </Link>
        </div>
      </section>
    </div>
  )
}