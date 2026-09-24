import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Gift,
  CarFront,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Power,
  ListPlus,
} from 'lucide-react'
import GoldDust from '../../components/GoldDust'
import ImageUpload from '../../components/admin/ImageUpload'
import { useStore } from '../../store/StoreContext'
import { fmtDateTimeLocal } from '../../lib/format'

function toLocal(iso) {
  return fmtDateTimeLocal(iso)
}

function OfferToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] transition-colors ${
        enabled
          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
          : 'border-red-500/50 bg-red-500/10 text-red-300'
      }`}
    >
      <Power className="h-4 w-4" /> {enabled ? 'Offer Live' : 'Offer Paused'}
    </button>
  )
}

function OfferEditor({ offer }) {
  const { setPartial } = useStore()
  const [form, setForm] = useState(() => ({
    name: offer.name,
    tagline: offer.tagline,
    description: offer.description,
    enabled: offer.enabled,
    threshold: offer.threshold,
    entryPer: offer.entryPer,
    totalRewards: offer.totalRewards,
    topN: offer.topN,
    carValue: offer.carValue,
    startDate: toLocal(offer.startDate),
    endDate: toLocal(offer.endDate),
    image: offer.image,
    rewards: offer.rewards.map((r) => ({ ...r })),
  }))
  const [saved, setSaved] = useState(null)
  const isCar = offer.id === 'tripleCar'
  const Icon = isCar ? CarFront : Gift

  const patch = (p) => setForm((f) => ({ ...f, ...p }))

  const save = (e) => {
    e.preventDefault()
    const rewards = form.rewards
      .filter((r) => r.label.trim())
      .map((r) => ({ label: r.label.trim(), count: Math.max(1, Number(r.count) || 1) }))
    const startIso = form.startDate ? new Date(form.startDate).toISOString() : offer.startDate
    const endIso = form.endDate ? new Date(form.endDate).toISOString() : offer.endDate
    setPartial((prev) => ({
      ...prev,
      offers: {
        ...prev.offers,
        [offer.id]: {
          ...prev.offers[offer.id],
          name: form.name.trim() || offer.name,
          tagline: form.tagline.trim(),
          description: form.description.trim(),
          enabled: form.enabled,
          threshold: Math.max(0, Number(form.threshold) || 0),
          entryPer: Math.max(1, Number(form.entryPer) || 2000),
          totalRewards: Math.max(0, Number(form.totalRewards) || 0),
          topN: Math.max(1, Number(form.topN) || 3),
          carValue: form.carValue.trim() || offer.carValue,
          startDate: startIso,
          endDate: endIso,
          image: form.image,
          rewards,
        },
      },
    }))
    setSaved('Offer saved & published')
    setTimeout(() => setSaved(null), 2400)
  }

  const setReward = (i, key, value) =>
    patch({ rewards: form.rewards.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)) })
  const addReward = () => patch({ rewards: [...form.rewards, { label: '', count: 1 }] })
  const removeReward = (i) => patch({ rewards: form.rewards.filter((_, idx) => idx !== i) })

  return (
    <motion.form
      onSubmit={save}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-3d glass rounded-3xl p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-gold-500/40 bg-gold-500/10">
            <Icon className="h-7 w-7 text-gold-300" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">{form.name || offer.name}</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">{isCar ? 'Grand Prize Program' : 'Rewards Program'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <OfferToggle enabled={form.enabled} onToggle={() => patch({ enabled: !form.enabled })} />
          <button type="submit" className="btn-gold !py-2.5 !text-[0.68rem]">
            <Save className="h-4 w-4" /> Publish
          </button>
        </div>
      </div>

      {saved && (
        <p className="mt-4 flex w-fit items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> {saved}
        </p>
      )}

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Offer Name</label>
            <input className="input-lux" value={form.name} onChange={(e) => patch({ name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Tagline</label>
            <input className="input-lux" value={form.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Description</label>
            <textarea
              className="input-lux min-h-28 resize-y"
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Offer Image</label>
            <ImageUpload
              label="Upload Offer Image"
              value={form.image}
              onChange={(v) => patch({ image: v })}
              aspect="16/9"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">
                {isCar ? 'Threshold (USD)' : 'Qualification (USD)'}
              </label>
              <input type="number" min="0" className="input-lux" value={form.threshold} onChange={(e) => patch({ threshold: e.target.value })} />
            </div>
            {isCar ? (
              <div>
                <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Car Value</label>
                <input className="input-lux" value={form.carValue} onChange={(e) => patch({ carValue: e.target.value })} />
              </div>
            ) : (
              <div>
                <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Entry Every (USD)</label>
                <input type="number" min="1" className="input-lux" value={form.entryPer} onChange={(e) => patch({ entryPer: e.target.value })} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {isCar ? (
              <div>
                <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Top Leaders</label>
                <input type="number" min="1" className="input-lux" value={form.topN} onChange={(e) => patch({ topN: e.target.value })} />
              </div>
            ) : (
              <div>
                <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Total Rewards</label>
                <input type="number" min="0" className="input-lux" value={form.totalRewards} onChange={(e) => patch({ totalRewards: e.target.value })} />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Start Date</label>
              <input type="datetime-local" className="input-lux" value={form.startDate} onChange={(e) => patch({ startDate: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">End Date</label>
              <input type="datetime-local" className="input-lux" value={form.endDate} onChange={(e) => patch({ endDate: e.target.value })} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">
                {isCar ? 'Cars / Prizes' : 'Reward Pool'}
              </p>
              <button type="button" onClick={addReward} className="flex items-center gap-1.5 rounded-full border border-gold-500/35 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-gold-200 transition-colors hover:bg-gold-500/10">
                <ListPlus className="h-3.5 w-3.5" /> Add Row
              </button>
            </div>
            <div className="space-y-2">
              {form.rewards.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className="input-lux flex-1"
                    placeholder={isCar ? 'Car name' : 'Reward name'}
                    value={r.label}
                    onChange={(e) => setReward(i, 'label', e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    className="input-lux w-20"
                    value={r.count}
                    onChange={(e) => setReward(i, 'count', e.target.value)}
                    title="Quantity"
                  />
                  <button
                    type="button"
                    onClick={() => removeReward(i)}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-red-500/30 text-red-400 transition-colors hover:bg-red-500/10"
                    aria-label="Remove reward"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {form.rewards.length === 0 && (
                <button type="button" onClick={addReward} className="w-full rounded-xl border border-dashed border-gold-500/40 py-6 text-xs font-bold uppercase tracking-[0.2em] text-white/40 hover:text-gold-200">
                  <Plus className="mx-auto mb-1 h-5 w-5" /> Add Rewards
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.form>
  )
}

export default function AdminOffers() {
  const { state } = useStore()
  return (
    <div className="relative">
      <GoldDust density={8} />
      <div className="mb-7">
        <h1 className="font-display text-3xl font-extrabold text-white">Offer Management</h1>
        <p className="mt-1 text-sm text-white/45">
          Configure names, descriptions, eligibility thresholds, prizes and reward pools for both offers.
        </p>
      </div>
      <div className="space-y-8">
        <OfferEditor key={state.offers.lucky50.id} offer={state.offers.lucky50} />
        <OfferEditor key={state.offers.tripleCar.id} offer={state.offers.tripleCar} />
      </div>
    </div>
  )
}