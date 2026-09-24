import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TimerReset,
  Pause,
  Play,
  CalendarClock,
  Megaphone,
  PaintBucket,
  CheckCircle2,
  RotateCcw,
  Square,
  Save,
  Image,
} from 'lucide-react'
import GoldDust from '../../components/GoldDust'
import ImageUpload from '../../components/admin/ImageUpload'
import Countdown from '../../components/Countdown'
import { useStore } from '../../store/StoreContext'
import { getCountdown, COUNTDOWN } from '../../lib/business'
import { fmtDateTimeLocal, fmtDate } from '../../lib/format'

export default function AdminCampaign() {
  const { state, setPartial } = useStore()
  const campaign = state.campaign
  const cd = getCountdown(state)
  const [title, setTitle] = useState(campaign.title)
  const [tagline, setTagline] = useState(campaign.tagline)
  const [announcement, setAnnouncement] = useState(state.meta.announcement)
  const [start, setStart] = useState(fmtDateTimeLocal(campaign.startDate))
  const [end, setEnd] = useState(fmtDateTimeLocal(campaign.endDate))
  const [saved, setSaved] = useState(null)

  const flash = (msg) => {
    setSaved(msg)
    setTimeout(() => setSaved(null), 2400)
  }

  const patchCampaign = (patch) => setPartial((prev) => ({ ...prev, campaign: { ...prev.campaign, ...patch } }))

  const onPause = () => {
    const remaining = getCountdown(state).ms
    patchCampaign({ status: COUNTDOWN.PAUSED, pausedRemainingMs: remaining })
    flash('Countdown paused')
  }
  const onResume = () => {
    const remaining = campaign.pausedRemainingMs || cd.ms || 0
    patchCampaign({
      status: COUNTDOWN.RUNNING,
      endDate: new Date(Date.now() + remaining).toISOString(),
      pausedRemainingMs: null,
    })
    flash('Countdown resumed')
  }
  const onReset = () => {
    patchCampaign({
      status: COUNTDOWN.RUNNING,
      endDate: new Date(Date.now() + campaign.defaultDurationMs).toISOString(),
      pausedRemainingMs: null,
    })
    setEnd(fmtDateTimeLocal(new Date(Date.now() + campaign.defaultDurationMs).toISOString()))
    flash('Countdown reset to default duration')
  }
  const onEnd = () => {
    patchCampaign({ status: COUNTDOWN.ENDED, pausedRemainingMs: null })
    flash('Campaign ended — public site shows CAMPAIGN ENDED')
  }

  const saveMeta = (e) => {
    e.preventDefault()
    const startIso = start ? new Date(start).toISOString() : campaign.startDate
    const endIso = end ? new Date(end).toISOString() : campaign.endDate
    setPartial((prev) => ({
      ...prev,
      campaign: {
        ...prev.campaign,
        title: title.trim() || campaign.title,
        tagline: tagline.trim() || campaign.tagline,
        startDate: startIso,
        endDate: endIso,
        status: prev.campaign.status === COUNTDOWN.ENDED ? COUNTDOWN.RUNNING : prev.campaign.status,
      },
      meta: { ...prev.meta, announcement },
    }))
    flash('Campaign settings saved & published')
  }

  const active = cd.status === COUNTDOWN.RUNNING
  const paused = cd.status === COUNTDOWN.PAUSED
  const ended = cd.status === COUNTDOWN.ENDED

  const control = (btn, onClick, disabled = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
        btn.variant === 'danger'
          ? 'border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20'
          : btn.variant === 'gold'
            ? 'border-gold-500/60 bg-gold-500/10 text-gold-200 hover:bg-gold-500/20'
            : 'border-royal-500/50 bg-royal-500/10 text-royal-300 hover:bg-royal-500/20'
      }`}
    >
      {btn.icon} {btn.label}
    </button>
  )

  return (
    <div className="relative">
      <GoldDust density={8} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">Campaign & Countdown Settings</h1>
          <p className="mt-1 text-sm text-white/45">Control schedule, countdown state, hero banner and announcement.</p>
        </div>
        {saved && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300"
          >
            <CheckCircle2 className="h-4 w-4" /> {saved}
          </motion.p>
        )}
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-2">
        {/* Countdown control */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d glass rounded-3xl p-7"
        >
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
            <TimerReset className="h-6 w-6 text-gold-300" /> Countdown Control
          </h2>

          <div className="my-6 flex justify-center rounded-2xl bg-[radial-gradient(circle,rgba(212,175,55,0.12),transparent_70%)] py-5">
            <Countdown size="md" />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] ${
                ended
                  ? 'border-red-500/40 bg-red-500/10 text-red-300'
                  : paused
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                    : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              }`}
            >
              Status: {campaign.status}
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/55">
              Ends {fmtDate(campaign.endDate)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {control({ icon: <Play className="h-4 w-4" />, label: active || ended ? 'Resume' : 'Start', variant: 'blue' }, onResume, active && !paused)}
            {control({ icon: <Pause className="h-4 w-4" />, label: 'Pause', variant: 'gold' }, onPause, !active)}
            {control({ icon: <RotateCcw className="h-4 w-4" />, label: 'Reset Timer', variant: 'blue' }, onReset)}
            {control({ icon: <Square className="h-4 w-4" />, label: 'End Now', variant: 'danger' }, onEnd)}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-white/40">
            Pausing freezes the remaining time. Resuming continues from the frozen point. Resetting restores the default campaign duration. Ending immediately shows “CAMPAIGN ENDED” to the public.
          </p>
        </motion.div>

        {/* Schedule + meta */}
        <motion.form
          onSubmit={saveMeta}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-3d glass rounded-3xl p-7"
        >
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
            <CalendarClock className="h-6 w-6 text-gold-300" /> Schedule & Branding
          </h2>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Campaign Title</label>
                <input className="input-lux" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Tagline</label>
                <input className="input-lux" value={tagline} onChange={(e) => setTagline(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">Start Date</label>
                <input type="datetime-local" className="input-lux" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">End Date</label>
                <input type="datetime-local" className="input-lux" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">
                <Megaphone className="h-3.5 w-3.5 text-gold-300" /> Announcement Text
              </label>
              <textarea className="input-lux min-h-24 resize-y" value={announcement} onChange={(e) => setAnnouncement(e.target.value)} />
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">
                <PaintBucket className="h-3.5 w-3.5 text-gold-300" /> Hero Banner
              </p>
              <ImageUpload
                label="Upload Hero Banner"
                value={state.meta.heroImage}
                onChange={(v) => {
                  setPartial((prev) => ({ ...prev, meta: { ...prev.meta, heroImage: v } }))
                  flash('Hero banner updated')
                }}
                aspect="16/6"
              />
              {!state.meta.heroImage && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-white/40">
                  <Image className="h-3.5 w-3.5" /> Using default campaign banner (offerheroic.png).
                </p>
              )}
            </div>
          </div>

          <div className="mt-7 flex justify-end">
            <button type="submit" className="btn-gold !py-2.5 !text-[0.68rem]">
              <Save className="h-4 w-4" /> Save Settings
            </button>
          </div>
        </motion.form>
      </div>

      {/* Duration stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="card-3d glass mt-6 grid gap-4 rounded-3xl p-7 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="glass rounded-2xl p-4">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-white/40">Start Date</p>
          <p className="mt-1 font-display text-lg font-bold text-white">{fmtDate(campaign.startDate)}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-white/40">End Date</p>
          <p className="mt-1 font-display text-lg font-bold text-white">{fmtDate(campaign.endDate)}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-white/40">Days Remaining</p>
          <p className="mt-1 font-display text-lg font-bold gold-text">{ended ? '0' : cd.days}d {cd.hours}h {cd.minutes}m</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-white/40">Default Duration</p>
          <p className="mt-1 font-display text-lg font-bold text-royal-300">
            {Math.round(campaign.defaultDurationMs / 86400000)} days
          </p>
        </div>
      </motion.div>
    </div>
  )
}