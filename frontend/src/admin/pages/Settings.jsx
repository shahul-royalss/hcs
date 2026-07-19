import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Inbox, Star } from 'lucide-react'
import Seo from '@/components/common/Seo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'
import { titleCase } from '@/utils/formatters'

function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-ink-light">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2',
          checked ? 'bg-secondary' : 'bg-slate-300'
        )}
      >
        <span
          className={cn(
            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-5'
          )}
        />
      </button>
    </div>
  )
}

/** Admin settings: profile, notification preferences and moderation shortcuts. */
export default function Settings() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    sms: true,
    email: true,
  })

  const toggle = (key) => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <>
      <Seo title="Admin — Settings" description="Admin profile and notification preferences." />

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold text-primary">Settings</h1>
        <p className="text-sm text-ink-light">Your profile and how Dhrishta notifies customers.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your admin account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-ink-light">Name</span>
              <span className="font-medium text-ink">{user?.name || '—'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-ink-light">Email</span>
              <span className="font-medium text-ink">{user?.email || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-light">Role</span>
              <Badge variant="secondary">{titleCase(user?.role || 'admin')}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Notifications</CardTitle>
            <CardDescription>
              Channels used for booking confirmations and reminders (delivered by the backend
              notification service when the corresponding API keys are configured).
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100">
            <ToggleSwitch
              label="WhatsApp confirmations"
              description="Booking confirmations and updates via WhatsApp"
              checked={notifications.whatsapp}
              onChange={() => toggle('whatsapp')}
            />
            <ToggleSwitch
              label="SMS notifications"
              description="Booking confirmation and 24-hour reminders by SMS"
              checked={notifications.sms}
              onChange={() => toggle('sms')}
            />
            <ToggleSwitch
              label="Email notifications"
              description="Welcome emails, confirmations and feedback requests"
              checked={notifications.email}
              onChange={() => toggle('email')}
            />
          </CardContent>
        </Card>

        {/* Moderation shortcuts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Website Moderation</CardTitle>
            <CardDescription>
              Reviews and inquiries now have dedicated workspaces in the sidebar.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/admin/reviews"
              className="group flex items-center gap-4 rounded-card border border-slate-100 p-5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-warning-50 text-warning">
                <Star className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block font-heading font-bold text-primary">Manage Reviews</span>
                <span className="text-sm text-ink-light">Approve, edit and feature testimonials</span>
              </span>
              <ArrowRight className="h-4 w-4 text-ink-light transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/admin/inquiries"
              className="group flex items-center gap-4 rounded-card border border-slate-100 p-5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary">
                <Inbox className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block font-heading font-bold text-primary">Manage Inquiries</span>
                <span className="text-sm text-ink-light">Follow up on contact-form messages</span>
              </span>
              <ArrowRight className="h-4 w-4 text-ink-light transition-transform group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
