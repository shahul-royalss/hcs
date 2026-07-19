import { Link, NavLink } from 'react-router-dom'
import {
  BarChart3,
  CalendarCheck,
  ExternalLink,
  HeartPulse,
  Images,
  Inbox,
  LayoutDashboard,
  Settings,
  Star,
  Users,
  X,
} from 'lucide-react'
import Logo from '@/components/common/Logo'
import { cn } from '@/utils/cn'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
      { to: '/admin/patients', label: 'Patients', icon: HeartPulse },
      { to: '/admin/staff', label: 'Staff', icon: Users },
    ],
  },
  {
    label: 'Website',
    items: [
      { to: '/admin/reviews', label: 'Reviews', icon: Star },
      { to: '/admin/gallery', label: 'Gallery', icon: Images },
      { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
    ],
  },
  {
    label: 'System',
    items: [{ to: '/admin/settings', label: 'Settings', icon: Settings }],
  },
]

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <Logo className="h-9 w-auto" />
        <span className="font-heading text-sm font-bold text-primary">Admin Portal</span>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 space-y-4 overflow-y-auto px-3 py-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-light/70">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary'
                        : 'text-ink-light hover:bg-surface hover:text-ink'
                    )
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-light transition-colors hover:bg-surface hover:text-ink"
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          View website
        </Link>
      </div>
    </div>
  )
}

/**
 * Admin navigation: fixed sidebar on desktop, overlay drawer on mobile.
 * Mobile drawer is controlled by the layout via `open` / `onClose`.
 */
export default function AdminSidebar({ open = false, onClose }) {
  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-100 bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-primary-900/60 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-card-hover">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="absolute right-3 top-5 rounded-full p-1.5 text-ink-light transition-colors hover:bg-surface hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  )
}
