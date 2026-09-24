import {
  Smartphone,
  Tablet,
  Watch,
  WashingMachine,
  Tv,
  Refrigerator,
  CarFront,
  Gift,
  Crown,
} from 'lucide-react'

const KNOWN = [
  'smartphone', 'phone',
  'tablet',
  'smart watch', 'watch',
  'washing machine', 'washingmachine',
  'led television', 'television', 'tv',
  'refrigerator', 'fridge',
  'sedan', 'suv', 'coupe', 'car',
]

export default function RewardIcon({ label, className = 'h-8 w-8' }) {
  const l = String(label || '').toLowerCase()
  let Icon = Gift
  if (l.includes('phone') || l.includes('smartphone')) Icon = Smartphone
  else if (l.includes('tablet')) Icon = Tablet
  else if (l.includes('watch')) Icon = Watch
  else if (l.includes('wash')) Icon = WashingMachine
  else if (l.includes('tv') || l.includes('television') || l.includes('led')) Icon = Tv
  else if (l.includes('fridge') || l.includes('refrigerator')) Icon = Refrigerator
  else if (l.includes('car') || l.includes('sedan') || l.includes('suv') || l.includes('coupe')) Icon = CarFront
  else if (l.includes('crown') || l.includes('luxury') || l.includes('bonanza')) Icon = Crown
  void KNOWN
  return <Icon className={className} />
}