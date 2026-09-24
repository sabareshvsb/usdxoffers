import { Megaphone } from 'lucide-react'
import { useStore } from '../store/StoreContext'

export default function AnnouncementBar() {
  const { state } = useStore()
  const text = state.meta.announcement
  if (!text) return null
  const doubled = `${text}   ✦   ${text}   ✦   `

  return (
    <div className="relative z-40 mt-16 overflow-hidden border-b border-gold-500/20 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
      <div className="flex items-center">
        <div className="z-10 flex shrink-0 items-center gap-2 border-r border-gold-500/30 bg-navy-900 px-4 py-2.5">
          <Megaphone className="h-4 w-4 text-gold-300" />
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-gold-300">
            Live
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee whitespace-nowrap py-2.5 text-sm text-white/70">
            <span className="pr-8">{doubled}</span>
            <span className="pr-8">{doubled}</span>
          </div>
        </div>
      </div>
    </div>
  )
}