import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Logo from '../../components/Logo'
import GoldDust from '../../components/GoldDust'
import { useAdminSession } from './useAdmin'

export default function AdminLogin() {
  const { login } = useAdminSession()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setTimeout(() => {
      const ok = login(password)
      if (ok) {
        window.location.hash = '#/admin'
      } else {
        setError('Invalid passcode. Access denied.')
        setBusy(false)
      }
    }, 450)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 grain px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.14),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(47,107,255,0.1),transparent_50%)]" />
      <GoldDust density={24} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 flex justify-center">
          <Logo size={52} />
        </div>

        <div className="card-3d glass rounded-3xl p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold-500/40 bg-gold-500/10">
              <Lock className="h-5 w-5 text-gold-300" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Admin Access</h1>
              <p className="text-xs text-white/45">Restricted command center</p>
            </div>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">
                Passcode
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="input-lux !pr-11"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold-200"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold text-red-400">
                {error}
              </motion.p>
            )}

            <button type="submit" className="btn-gold w-full" disabled={busy}>
              {busy ? 'Verifying…' : 'Unlock Admin'}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[0.62rem] uppercase tracking-[0.2em] text-white/35">
              <ShieldCheck className="h-3.5 w-3.5 text-gold-300/70" />
              Demo passcode: usdx2026
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          <a href="#/" className="hover:text-gold-200">← Back to Campaign Site</a>
        </p>
      </motion.div>
    </div>
  )
}