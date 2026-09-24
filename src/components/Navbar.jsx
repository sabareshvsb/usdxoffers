import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Gem } from 'lucide-react'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Home' },
  { to: '/offers', label: 'Offers' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-deep border-b border-gold-500/20 py-2.5' : 'bg-transparent py-4'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-10">
          <Logo size={42} />
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] transition-colors ${
                    isActive
                      ? 'text-gold-300 bg-gold-500/10'
                      : 'text-white/60 hover:text-gold-200'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/leaderboard" className="btn-ghost !px-5 !py-2 !text-[0.7rem]">
            My Progress
          </Link>
          <Link to="/offers" className="btn-gold !px-5 !py-2 !text-[0.7rem]">
            <Gem className="h-4 w-4" /> View Offers
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl text-gold-200 glass lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden border-t border-gold-500/15 glass-deep lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {[
                ...links,
                { to: '/my-progress', label: 'My Progress' },
                { to: '/admin/login', label: 'Admin' },
              ].map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] ${
                      isActive ? 'text-gold-300 bg-gold-500/10' : 'text-white/70'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}