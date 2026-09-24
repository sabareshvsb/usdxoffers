import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="relative border-t border-gold-500/15 bg-navy-900/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="text-center md:text-left">
            <Logo size={40} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              A premium international rewards campaign celebrating business
              achievement. Dream higher. Draw your chance. Win beyond measure.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <h4 className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-gold-300">
                Campaign
              </h4>
              <ul className="space-y-2 text-white/60">
                <li><Link to="/offers" className="hover:text-gold-200">All Offers</Link></li>
                <li><Link to="/lucky-50" className="hover:text-gold-200">Lucky 50</Link></li>
                <li><Link to="/triple-car" className="hover:text-gold-200">Triple Car Bonanza</Link></li>
                <li><Link to="/leaderboard" className="hover:text-gold-200">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-gold-300">
                Access
              </h4>
              <ul className="space-y-2 text-white/60">
                <li>
                  <Link to="/my-progress" className="hover:text-gold-200">
                    My Progress
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="flex items-center gap-1.5 hover:text-gold-200">
                    <Lock className="h-3.5 w-3.5" /> Admin Panel
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
          <p>© {new Date().getFullYear()} USDX-SMART Rewards Campaign. All rights reserved.</p>
          <p className="tracking-[0.24em] uppercase">Dream • Draw • Win</p>
        </div>
      </div>
    </footer>
  )
}