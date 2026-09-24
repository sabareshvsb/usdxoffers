import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 pt-28 text-center">
      <Compass className="h-14 w-14 text-gold-300" />
      <h1 className="mt-6 font-display text-5xl font-extrabold text-white">404</h1>
      <p className="mt-3 text-white/55">This page drifted off the campaign trail.</p>
      <Link to="/" className="btn-gold mt-8">Return Home</Link>
    </div>
  )
}