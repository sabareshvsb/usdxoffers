import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Gift, TimerReset, LogOut, ExternalLink, ShieldCheck } from 'lucide-react'
import Logo from '../../components/Logo'
import { useAdminSession } from './useAdmin'
import { useStore } from '../../store/StoreContext'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/leaders', label: 'Leaders', icon: Users },
  { to: '/admin/offers', label: 'Offers', icon: Gift },
  { to: '/admin/campaign', label: 'Campaign & Countdown', icon: TimerReset },
]

export default function AdminLayout() {
  const { authed, logout } = useAdminSession()
  const { state } = useStore()

  if (!authed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-950 px-4 text-center">
        <ShieldCheck className="h-10 w-10 text-gold-300" />
        <p className="text-white/70">You must sign in to access the admin panel.</p>
        <a href="#/admin/login" className="btn-gold">Go to Admin Login</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-950 grain lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="glass-deep sticky top-0 z-40 border-b border-gold-500/15 lg:h-screen lg:border-b-0 lg:border-r lg:p-5">
        <div className="flex items-center justify-between px-4 py-3 lg:px-2">
          <a href="#/admin" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl gold-bg font-display font-extrabold text-navy-950">U</span>
            <span>
              <span className="block font-display font-extrabold text-white">USDX-SMART</span>
              <span className="block text-[0.55rem] font-bold uppercase tracking-[0.3em] text-gold-300">Admin Panel</span>
            </span>
          </a>
          <button onClick={logout} className="grid h-9 w-9 place-items-center rounded-lg border border-red-500/40 text-red-400 lg:hidden" aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:mt-6 lg:flex-col lg:overflow-visible lg:px-2">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-[0.7rem] font-bold uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? 'gold-bg !text-navy-950'
                    : 'text-white/55 hover:bg-gold-500/10 hover:text-gold-200'
                }`
              }
            >
              <n.icon className="h-4 w-4" />
              <span>{n.label}</span>
            </NavLink>
          ))}
          <a
            href="#/"
            className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/55 transition-colors hover:bg-blue-500/10 hover:text-royal-300 lg:mt-auto"
          >
            <ExternalLink className="h-4 w-4" /> View Site
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="min-w-0">
        <div className="flex items-center justify-between border-b border-gold-500/15 px-5 py-3 lg:px-10">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.26em] text-white/45">
            Campaign Control Center
          </p>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-gold-200 sm:flex">
              <ShieldCheck className="h-3.5 w-3.5" /> Secured Session
            </span>
            <button onClick={logout} className="hidden items-center gap-2 rounded-full border border-red-500/40 px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-red-400 transition-colors hover:bg-red-500/10 sm:flex">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="px-5 py-8 lg:px-10"
        >
          <Outlet />
        </motion.div>
      </main>

      <div className="hidden">
        <Logo />
        <span>{state.meta.name}</span>
      </div>
    </div>
  )
}