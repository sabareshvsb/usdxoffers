import { useRef } from 'react'
import { ImagePlus, Upload, Trash2 } from 'lucide-react'

export default function ImageUpload({ label = 'Upload Image', value, onChange, aspect = undefined }) {
  const inputRef = useRef(null)

  const readFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">{label}</p>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-gold-500/30">
          <img
            src={value}
            alt="Preview"
            className="h-40 w-full object-cover"
            style={aspect ? { aspectRatio: aspect } : undefined}
          />
          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-navy-950/90 to-transparent p-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-full border border-gold-500/50 bg-navy-950/80 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-gold-200 transition-colors hover:bg-gold-500/20"
            >
              <Upload className="h-3.5 w-3.5" /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1.5 rounded-full border border-red-500/50 bg-navy-950/80 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-red-300 transition-colors hover:bg-red-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gold-500/40 bg-white/3 py-10 text-white/45 transition-colors hover:border-gold-500/70 hover:text-gold-200"
        >
          <ImagePlus className="h-8 w-8" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">{label}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => readFile(e.target.files?.[0])} />
    </div>
  )
}