import { useEffect, useRef } from 'react'

// Cinematic floating gold-dust particles on a canvas.
export default function GoldDust({ density = 40, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let w = 0
    let h = 0
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * DPR
      canvas.height = h * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    const particles = Array.from({ length: density }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.9,
      o: 0.12 + Math.random() * 0.55,
      vx: (Math.random() - 0.5) * 0.00035,
      vy: -0.00018 - Math.random() * 0.00045,
      tw: Math.random() * Math.PI * 2,
    }))

    const colors = ['212,175,55', '243,215,102', '253,246,216']

    const tick = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -0.05) p.y = 1.05
        if (p.x < -0.05) p.x = 1.05
        if (p.x > 1.05) p.x = -0.05
        const twinkle = 0.55 + 0.45 * Math.sin(t / 900 + p.tw)
        const alpha = p.o * twinkle
        const c = colors[Math.floor(p.x * colors.length) % colors.length]
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c},${alpha})`
        ctx.shadowColor = `rgba(212,175,55,0.9)`
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    raf = requestAnimationFrame(tick)
    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [density])

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />
}