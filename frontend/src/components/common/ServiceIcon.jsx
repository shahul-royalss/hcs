import {
  Accessibility,
  Activity,
  Armchair,
  Baby,
  BedDouble,
  Brain,
  CalendarDays,
  CalendarRange,
  Clock,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  Puzzle,
  Settings2,
  ShieldCheck,
  Stethoscope,
  Sun,
  SunMedium,
  Syringe,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'

/** Maps icon names stored in data files to lucide-react components. */
const ICON_MAP = {
  Accessibility,
  Activity,
  Armchair,
  Baby,
  BedDouble,
  Brain,
  CalendarDays,
  CalendarRange,
  Clock,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  Puzzle,
  Settings2,
  ShieldCheck,
  Stethoscope,
  Sun,
  SunMedium,
  Syringe,
  TrendingUp,
  Users,
  Wallet,
}

export default function ServiceIcon({ name, className = 'h-6 w-6', ...props }) {
  const Icon = ICON_MAP[name] || HeartPulse
  return <Icon className={className} {...props} />
}
