import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Gem,
  CarFront,
  CheckCircle2,
  Save,
  UserPlus,
} from 'lucide-react'
import GoldDust from '../../components/GoldDust'
import { useStore } from '../../store/StoreContext'
import { luckyEntries } from '../../lib/business'
import { fmtNum, fmtUSD } from '../../lib/format'

const DAY = 24 * 60 * 60 * 1000

function buildHistory(volume, weeks = 8) {
  const entries = []
  let remaining = Math.max(0, volume)
  const now = Date.now()
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now - i * 7 * DAY).toISOString().slice(0, 10)
    if (i === 0) {
      entries.push({ date: d, volume: Math.round(remaining) })
      continue
    }
    const share = Math.round(volume / weeks)
    const v = Math.min(remaining, share)
    entries.push({ date: d, volume: v })
    remaining -= v
  }
  return entries
}

const emptyForm = () => ({
  name: '',
  team: '',
  volume: 0,
  lucky: true,
  car: false,
})

export default function AdminLeaders() {
  const { state, setPartial } = useStore()
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null) // null | { mode:'create' } | { mode:'edit', leader }
  const [form, setForm] = useState(emptyForm())
  const [confirmId, setConfirmId] = useState(null)
  const [saved, setSaved] = useState(null)

  const leaders = useMemo(() => {
    if (!query.trim()) return state.leaders
    const q = query.toLowerCase()
    return state.leaders.filter((l) => l.name.toLowerCase().includes(q) || l.team.toLowerCase().includes(q))
  }, [state.leaders, query])

  const openCreate = () => {
    setForm(emptyForm())
    setModal({ mode: 'create' })
  }
  const openEdit = (leader) => {
    setForm({
      name: leader.name,
      team: leader.team,
      volume: leader.volume,
      lucky: (leader.currentOffer || 'lucky50').includes('lucky50'),
      car: (leader.currentOffer || '').includes('tripleCar'),
    })
    setModal({ mode: 'edit', id: leader.id })
  }
  const close = () => setModal(null)

  const save = (e) => {
    e.preventDefault()
    const today = new Date().toISOString().slice(0, 10)
    const offers = [form.lucky ? 'lucky50' : null, form.car ? 'tripleCar' : null].filter(Boolean)
    const nextOffers = offers.length ? offers.join(',') : 'lucky50'

    setPartial((prev) => {
      if (modal.mode === 'edit') {
        return {
          ...prev,
          leaders: prev.leaders.map((l) => {
            if (l.id !== modal.id) return l
            const history = form.volume !== l.volume
              ? [{ date: today, volume: Math.max(0, form.volume - l.volume) }, ...l.history].slice(0, 12)
              : l.history
            return {
              ...l,
              name: form.name.trim() || l.name,
              team: form.team.trim() || l.team,
              volume: Number(form.volume) || 0,
              currentOffer: nextOffers,
              updatedAt: today,
              history,
            }
          }),
        }
      }
      const now = Date.now()
      const id = `L${now}`
      const leader = {
        id,
        name: form.name.trim() || 'Unnamed Leader',
        team: form.team.trim() || 'Independent',
        volume: Number(form.volume) || 0,
        currentOffer: nextOffers,
        updatedAt: today,
        history: buildHistory(Number(form.volume) || 0),
      }
      return { ...prev, leaders: [...prev.leaders, leader] }
    })

    setSaved(modal.mode === 'edit' ? 'Leader updated' : 'Leader created')
    setTimeout(() => setSaved(null), 2200)
    close()
  }

  const removeLeader = (id) => {
    setPartial((prev) => ({ ...prev, leaders: prev.leaders.filter((l) => l.id !== id) }))
    setSaved('Leader removed')
    setTimeout(() => setSaved(null), 2200)
    setConfirmId(null)
  }

  const chip = (leader) => {
    const offers = (leader.currentOffer || 'lucky50').split(',')
    return (
      <span className="inline-flex gap-1.5">
        {offers.includes('tripleCar') && (
          <span className="flex items-center gap-1 rounded-full border border-royal-500/40 bg-royal-500/10 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-royal-300">
            <CarFront className="h-3 w-3" /> Car
          </span>
        )}
        {offers.includes('lucky50') && (
          <span className="flex items-center gap-1 rounded-full border border-gold-500/35 bg-gold-500/10 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-gold-200">
            <Gem className="h-3 w-3" /> Lucky 50
          </span>
        )}
      </span>
    )
  }

  return (
    <div className="relative">
      <GoldDust density={8} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">Leader Management</h1>
          <p className="mt-1 text-sm text-white/45">Add, edit, rank and remove leaders. Changes go live immediately.</p>
        </div>
        <button onClick={openCreate} className="btn-gold !py-2.5">
          <Plus className="h-4 w-4" /> Add Leader
        </button>
      </div>

      {saved && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex w-fit items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4" /> {saved}
        </motion.p>
      )}

      <div className="mt-6">
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-300/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leaders..."
            className="input-lux !pl-11"
          />
        </div>

        {/* Desktop table */}
        <div className="card-3d glass overflow-x-auto rounded-3xl">
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left">
                {['Leader Name', 'Team', 'Business Volume', 'Entries', 'Offers', 'Last Updated', ''].map((h, i) => (
                  <th key={i} className={`border-b border-gold-500/25 px-5 py-4 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-gold-300/90 ${i >= 2 && i <= 3 ? (i === 3 ? 'text-center' : 'text-right') : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaders.map((l) => (
                <tr key={l.id} className="group transition-colors hover:bg-white/3">
                  <td className="border-b border-white/5 px-5 py-3.5 font-display text-base font-bold text-white">{l.name}</td>
                  <td className="border-b border-white/5 px-5 py-3.5 text-sm text-white/50">{l.team}</td>
                  <td className="border-b border-white/5 px-5 py-3.5 text-right font-display font-bold gold-text">{fmtUSD(l.volume)}</td>
                  <td className="border-b border-white/5 px-5 py-3.5 text-center text-sm font-bold text-white">{fmtNum(luckyEntries(l.volume, state.offers.lucky50.entryPer))}</td>
                  <td className="border-b border-white/5 px-5 py-3.5">{chip(l)}</td>
                  <td className="border-b border-white/5 px-5 py-3.5 text-xs text-white/40">{l.updatedAt}</td>
                  <td className="border-b border-white/5 px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEdit(l)} className="grid h-9 w-9 place-items-center rounded-lg border border-gold-500/30 text-gold-300 transition-colors hover:bg-gold-500/10" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setConfirmId(l.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-red-500/30 text-red-400 transition-colors hover:bg-red-500/10" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leaders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-sm text-white/40">
                    No leaders found. Add your first leader to start the board.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-navy-950/80 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.form
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              onSubmit={save}
              className="card-3d w-full max-w-lg rounded-3xl p-7"
            >
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
                  <UserPlus className="h-5 w-5 text-gold-300" />
                  {modal.mode === 'edit' ? 'Edit Leader' : 'New Leader'}
                </h2>
                <button type="button" onClick={close} className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white/50 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Leader Name</label>
                  <input className="input-lux" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Arjun Mehta" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Team Name</label>
                  <input className="input-lux" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} placeholder="e.g. Peak Performers" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Total Business Volume (USD)</label>
                  <input
                    type="number"
                    min="0"
                    className="input-lux"
                    value={form.volume}
                    onChange={(e) => setForm({ ...form, volume: e.target.value })}
                    placeholder="2000"
                  />
                </div>
                <div>
                  <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Offers</p>
                  <div className="flex flex-wrap gap-3">
                    <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${form.lucky ? 'border-gold-500/60 bg-gold-500/10 text-gold-200' : 'border-white/10 text-white/40'}`}>
                      <input type="checkbox" checked={form.lucky} onChange={(e) => setForm({ ...form, lucky: e.target.checked })} className="accent-[#d4af37]" />
                      <Gem className="h-4 w-4" /> Lucky 50
                    </label>
                    <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${form.car ? 'border-royal-500/60 bg-royal-500/10 text-royal-300' : 'border-white/10 text-white/40'}`}>
                      <input type="checkbox" checked={form.car} onChange={(e) => setForm({ ...form, car: e.target.checked })} className="accent-[#2f6bff]" />
                      <CarFront className="h-4 w-4" /> Triple Car
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex justify-end gap-3">
                <button type="button" onClick={close} className="btn-ghost !py-2.5 !text-[0.68rem]">Cancel</button>
                <button type="submit" className="btn-gold !py-2.5 !text-[0.68rem]">
                  <Save className="h-4 w-4" /> Save Leader
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-navy-950/80 p-4 backdrop-blur-sm"
            onClick={() => setConfirmId(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-3d w-full max-w-sm rounded-3xl p-7 text-center"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-red-500/40 bg-red-500/10">
                <Trash2 className="h-6 w-6 text-red-400" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-white">Remove leader?</h3>
              <p className="mt-2 text-sm text-white/50">
                This removes the leader from the leaderboard and all offers. This cannot be undone.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={() => setConfirmId(null)} className="btn-ghost !py-2.5 !text-[0.68rem]">Cancel</button>
                <button onClick={() => removeLeader(confirmId)} className="inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-500/15 px-6 py-2.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-red-300 transition-colors hover:bg-red-500/25">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}