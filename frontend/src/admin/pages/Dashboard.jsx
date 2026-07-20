import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarCheck,
  Clock3,
  ImagePlus,
  IndianRupee,
  Inbox,
  MessageSquare,
  RefreshCw,
  Siren,
  Star,
  UserPlus,
  Users,
} from 'lucide-react'
import Seo from '@/components/common/Seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import StatCards from '@/admin/components/StatCards'
import BookingTable from '@/admin/components/BookingTable'
import { adminService } from '@/services/adminService'
import { apiErrorMessage } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatINR, titleCase } from '@/utils/formatters'

const QUICK_ACTIONS = [
  { to: '/admin/bookings', label: 'Manage Bookings', icon: CalendarCheck },
  { to: '/admin/staff', label: 'Add Staff', icon: UserPlus },
  { to: '/admin/reviews', label: 'Moderate Reviews', icon: Star },
  { to: '/admin/gallery', label: 'Add Gallery Image', icon: ImagePlus },
  { to: '/admin/inquiries', label: 'View Inquiries', icon: Inbox },
]

const pick = (...values) => values.find((value) => value !== undefined && value !== null)

function ErrorCard({ onRetry, detail }) {
  return (
    <Card className="p-8 text-center">
      <p className="font-medium text-ink">Could not reach the server — is the backend running?</p>
      {detail && <p className="mt-1 text-sm text-ink-light">{detail}</p>}
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </Card>
  )
}

/** Admin overview: stats, urgent alerts, quick actions, bookings and inquiries. */
export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await adminService.dashboard())
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const stats = [
    {
      label: 'Total bookings',
      value: pick(data?.total_bookings, data?.totals?.bookings, 0),
      icon: CalendarCheck,
      color: 'primary',
    },
    {
      label: 'Pending bookings',
      value: pick(data?.pending_bookings, data?.totals?.pending, 0),
      icon: Clock3,
      color: 'warning',
    },
    {
      label: 'Active staff',
      value: pick(data?.active_staff, data?.available_staff, data?.totals?.staff, 0),
      icon: Users,
      color: 'secondary',
    },
    {
      label: 'New inquiries',
      value: pick(data?.new_inquiries, data?.pending_contacts, data?.totals?.inquiries, 0),
      icon: MessageSquare,
      color: 'gold',
    },
    {
      label: 'Pending reviews',
      value: pick(data?.testimonials_pending, data?.pending_reviews, 0),
      icon: Star,
      color: 'warning',
    },
    {
      label: 'Revenue this month',
      value: formatINR(pick(data?.revenue_this_month, data?.monthly_revenue, data?.revenue?.this_month)),
      icon: IndianRupee,
      color: 'success',
    },
  ]

  const recentBookings = [data?.recent_bookings, data?.recentBookings, data?.recent].find(Array.isArray) || []
  const inquiries =
    [data?.pending_inquiries, data?.recent_inquiries, data?.inquiries, data?.contacts].find(Array.isArray) || []
  const urgentBookings = recentBookings.filter(
    (b) => (b?.schedule?.urgency || b?.urgency) === 'urgent' && b?.status === 'pending'
  )

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <>
      <Seo title="Admin — Dashboard" />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-ink-light">{today} — a live overview of Dhrishta operations</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} aria-label="Refresh dashboard">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            <Skeleton className="h-72 xl:col-span-2" />
            <Skeleton className="h-72" />
          </div>
        </div>
      ) : error ? (
        <ErrorCard onRetry={load} detail={error} />
      ) : (
        <div className="space-y-6">
          {urgentBookings.length > 0 && (
            <Card className="border-accent/30 bg-accent-50 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white">
                  <Siren className="h-5 w-5" />
                </span>
                <p className="flex-1 text-sm font-semibold text-ink">
                  {urgentBookings.length} urgent booking{urgentBookings.length > 1 ? 's' : ''} awaiting
                  action — respond within 30 minutes.
                </p>
                <Link to="/admin/bookings">
                  <Button variant="accent" size="sm">
                    Review Now
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          <StatCards stats={stats} />

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3">
            {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-2 rounded-full border border-ivory-300 bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-secondary hover:text-secondary-700"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Recent bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingTable bookings={recentBookings} onView={() => navigate('/admin/bookings')} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {inquiries.length === 0 ? (
                  <p className="py-6 text-center text-sm text-ink-light">No records yet</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {inquiries.map((inquiry, index) => (
                      <li
                        key={inquiry?.id || inquiry?._id || index}
                        className="flex items-start justify-between gap-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{inquiry?.name || '—'}</p>
                          <p className="truncate text-xs text-ink-light">
                            {titleCase(inquiry?.service_interested || inquiry?.service || 'General inquiry')}
                          </p>
                          <p className="truncate text-xs text-ink-light">{inquiry?.phone || '—'}</p>
                        </div>
                        <span className="shrink-0 text-xs text-ink-light">
                          {formatDate(inquiry?.created_at || inquiry?.createdAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
