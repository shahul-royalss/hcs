import { Eye, UserPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BOOKING_STATUS } from '@/utils/constants'
import { formatDate, titleCase } from '@/utils/formatters'

const bookingRef = (booking) => booking?.booking_id || booking?.id || booking?._id || '—'

/**
 * Bookings table used by Dashboard (read-only) and Bookings (fully wired).
 * Handlers are optional — controls render only when the matching handler exists.
 */
export default function BookingTable({ bookings = [], onView, onAssign, onUpdateStatus }) {
  if (!bookings.length) {
    return <p className="py-8 text-center text-sm text-ink-light">No records yet</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Package</TableHead>
          <TableHead>Start date</TableHead>
          <TableHead>Urgency</TableHead>
          <TableHead>Status</TableHead>
          {(onView || onAssign) && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking, index) => {
          const status = booking?.status || 'pending'
          const statusMeta = BOOKING_STATUS[status]
          const isUrgent = booking?.urgency === 'urgent'

          return (
            <TableRow key={booking?.id || booking?._id || booking?.booking_id || index}>
              <TableCell className="font-mono text-xs text-ink">{bookingRef(booking)}</TableCell>
              <TableCell className="font-medium text-ink">
                {booking?.patient_info?.name || '—'}
              </TableCell>
              <TableCell>{titleCase(booking?.service_type) || '—'}</TableCell>
              <TableCell>{titleCase(booking?.package_type || booking?.package) || '—'}</TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(booking?.schedule?.start_date)}
              </TableCell>
              <TableCell>
                <Badge variant={isUrgent ? 'accent' : 'neutral'}>
                  {isUrgent ? 'Urgent' : titleCase(booking?.urgency || 'normal')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1.5">
                  <Badge variant={statusMeta?.color || 'neutral'}>
                    {statusMeta?.label || titleCase(status)}
                  </Badge>
                  {onUpdateStatus && (
                    <Select
                      value={status}
                      onChange={(event) => onUpdateStatus(booking, event.target.value)}
                      aria-label={`Change status for booking ${bookingRef(booking)}`}
                      className="h-9 w-36 text-xs"
                    >
                      {Object.entries(BOOKING_STATUS).map(([value, { label }]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
              </TableCell>
              {(onView || onAssign) && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(booking)}
                        aria-label={`View booking ${bookingRef(booking)}`}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    )}
                    {onAssign && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAssign(booking)}
                        aria-label={`Assign staff to booking ${bookingRef(booking)}`}
                      >
                        <UserPlus className="h-4 w-4" />
                        Assign
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
