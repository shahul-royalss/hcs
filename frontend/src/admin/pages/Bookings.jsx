import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw, Search, UserPlus } from 'lucide-react'
import Seo from '@/components/common/Seo'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import BookingTable from '@/admin/components/BookingTable'
import { bookingService } from '@/services/bookingService'
import { adminService } from '@/services/adminService'
import { apiErrorMessage } from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { BOOKING_STATUS } from '@/utils/constants'
import { formatDate, formatINR, titleCase } from '@/utils/formatters'

const asList = (data, ...keys) => {
  if (Array.isArray(data)) return data
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key]
  }
  return []
}

const idOf = (booking) => booking?.id || booking?._id || booking?.booking_id

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-ink-light">{label}</span>
      <span className="text-right font-medium text-ink">{value ?? '—'}</span>
    </div>
  )
}

function DetailSection({ title, children }) {
  return (
    <div className="mb-4">
      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-light">{title}</h4>
      <div className="rounded-xl bg-surface px-4 py-2">{children}</div>
    </div>
  )
}

function BookingDetailDialog({ booking, onClose }) {
  const status = booking?.status || 'pending'
  const statusMeta = BOOKING_STATUS[status]

  return (
    <Dialog open onClose={onClose} title="Booking details" className="max-w-xl">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-ink-light">{booking?.booking_id || idOf(booking) || '—'}</span>
        <Badge variant={statusMeta?.color || 'neutral'}>{statusMeta?.label || titleCase(status)}</Badge>
        {booking?.urgency === 'urgent' && <Badge variant="accent">Urgent</Badge>}
      </div>

      <DetailSection title="Service">
        <DetailRow label="Service" value={titleCase(booking?.service_type) || '—'} />
        <DetailRow label="Package" value={titleCase(booking?.package_type || booking?.package) || '—'} />
        <DetailRow label="Created" value={formatDate(booking?.created_at || booking?.createdAt)} />
      </DetailSection>

      <DetailSection title="Patient">
        <DetailRow label="Name" value={booking?.patient_info?.name} />
        <DetailRow label="Age" value={booking?.patient_info?.age} />
        <DetailRow label="Gender" value={titleCase(booking?.patient_info?.gender) || '—'} />
        <DetailRow label="Condition" value={booking?.patient_info?.medical_condition || booking?.patient_info?.condition} />
      </DetailSection>

      <DetailSection title="Contact">
        <DetailRow label="Name" value={booking?.contact_info?.name} />
        <DetailRow label="Phone" value={booking?.contact_info?.phone} />
        <DetailRow label="Email" value={booking?.contact_info?.email} />
        <DetailRow label="Address" value={booking?.contact_info?.address} />
      </DetailSection>

      <DetailSection title="Schedule">
        <DetailRow label="Start date" value={formatDate(booking?.schedule?.start_date)} />
        <DetailRow label="End date" value={formatDate(booking?.schedule?.end_date)} />
        <DetailRow label="Time slot" value={booking?.schedule?.time_slot} />
        <DetailRow label="Duration" value={booking?.schedule?.duration} />
      </DetailSection>

      <DetailSection title="Staff">
        <DetailRow
          label="Assigned staff"
          value={booking?.assigned_staff?.name || booking?.assigned_staff_name || 'Not assigned'}
        />
        <DetailRow
          label="Preference"
          value={titleCase(booking?.staff_preference?.gender || booking?.staff_preference) || '—'}
        />
      </DetailSection>

      <DetailSection title="Payment">
        <DetailRow label="Amount" value={formatINR(booking?.payment?.amount ?? booking?.total_amount)} />
        <DetailRow label="Status" value={titleCase(booking?.payment?.status || booking?.payment_status) || '—'} />
        <DetailRow label="Method" value={titleCase(booking?.payment?.method) || '—'} />
      </DetailSection>

      {(booking?.notes || booking?.special_requirements) && (
        <DetailSection title="Notes">
          <p className="whitespace-pre-wrap py-1.5 text-sm text-ink">
            {booking?.notes || booking?.special_requirements}
          </p>
        </DetailSection>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </Dialog>
  )
}

function AssignStaffDialog({ booking, onClose, onAssigned }) {
  const { toast } = useToast()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [assigningId, setAssigningId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.availableStaff()
      setStaff(asList(data, 'staff', 'items', 'results'))
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const assign = async (member) => {
    const memberId = member?.id || member?._id
    setAssigningId(memberId)
    try {
      await bookingService.assignStaff(idOf(booking), memberId)
      toast.success(`${member?.name || 'Staff member'} assigned to booking`)
      onAssigned()
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not assign staff.'))
    } finally {
      setAssigningId(null)
    }
  }

  return (
    <Dialog open onClose={onClose} title="Assign staff">
      <p className="mb-4 text-sm text-ink-light">
        Booking <span className="font-mono text-xs">{booking?.booking_id || idOf(booking) || '—'}</span>
        {booking?.patient_info?.name ? ` — ${booking.patient_info.name}` : ''}
      </p>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : error ? (
        <div className="py-4 text-center">
          <p className="text-sm text-ink-light">Could not reach the server — is the backend running?</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={load}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : staff.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-light">No available staff right now</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {staff.map((member, index) => (
            <li key={member?.id || member?._id || index} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{member?.name || '—'}</p>
                <p className="truncate text-xs text-ink-light">
                  {titleCase(member?.designation) || '—'}
                  {member?.experience_years != null ? ` · ${member.experience_years} yrs` : ''}
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => assign(member)}
                disabled={assigningId != null}
                aria-label={`Assign ${member?.name || 'staff member'}`}
              >
                <UserPlus className="h-4 w-4" />
                {assigningId === (member?.id || member?._id) ? 'Assigning…' : 'Assign'}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  )
}

/** Full booking management: list, filter, status updates, staff assignment. */
export default function Bookings() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [viewBooking, setViewBooking] = useState(null)
  const [assignBooking, setAssignBooking] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await bookingService.list()
      setBookings(asList(data, 'bookings', 'items', 'results'))
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return bookings.filter((booking) => {
      if (statusFilter !== 'all' && booking?.status !== statusFilter) return false
      if (!query) return true
      return [
        booking?.booking_id,
        booking?.id,
        booking?._id,
        booking?.patient_info?.name,
        booking?.contact_info?.name,
        booking?.contact_info?.phone,
        booking?.patient_info?.phone,
      ].some((value) => String(value || '').toLowerCase().includes(query))
    })
  }, [bookings, statusFilter, search])

  const handleUpdateStatus = async (booking, status) => {
    try {
      await bookingService.update(idOf(booking), { status })
      toast.success(`Booking marked ${BOOKING_STATUS[status]?.label?.toLowerCase() || status}`)
      load()
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not update booking status.'))
    }
  }

  return (
    <>
      <Seo title="Admin — Bookings" />
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Bookings</h1>
        <p className="text-sm text-ink-light">Track bookings, update status and assign staff</p>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by booking ID, patient or phone"
              aria-label="Search bookings"
              className="pl-10"
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {Object.entries(BOOKING_STATUS).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="space-y-3 p-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </Card>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="font-medium text-ink">Could not reach the server — is the backend running?</p>
          <p className="mt-1 text-sm text-ink-light">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={load}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          {bookings.length > 0 && filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-light">No bookings match your filters.</p>
          ) : (
            <BookingTable
              bookings={filtered}
              onView={setViewBooking}
              onAssign={setAssignBooking}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </Card>
      )}

      {viewBooking && <BookingDetailDialog booking={viewBooking} onClose={() => setViewBooking(null)} />}

      {assignBooking && (
        <AssignStaffDialog
          booking={assignBooking}
          onClose={() => setAssignBooking(null)}
          onAssigned={() => {
            setAssignBooking(null)
            load()
          }}
        />
      )}
    </>
  )
}
