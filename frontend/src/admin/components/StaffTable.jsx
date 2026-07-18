import { useState } from 'react'
import { Pencil, Star, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { titleCase } from '@/utils/formatters'

const AVAILABILITY = {
  available: { label: 'Available', color: 'success' },
  assigned: { label: 'Assigned', color: 'primary' },
  on_leave: { label: 'On Leave', color: 'warning' },
}

const staffId = (member) => member?.id || member?._id

/** Staff table with edit + confirm-before-delete actions. */
export default function StaffTable({ staff = [], onEdit, onDelete }) {
  const [confirmTarget, setConfirmTarget] = useState(null)

  if (!staff.length) {
    return <p className="py-8 text-center text-sm text-ink-light">No records yet</p>
  }

  const confirmDelete = () => {
    if (confirmTarget) onDelete?.(confirmTarget)
    setConfirmTarget(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Languages</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member, index) => {
            const availability = AVAILABILITY[member?.availability_status]
            const rating = Number(member?.rating)
            const photo = member?.photo_url || member?.photo

            return (
              <TableRow key={staffId(member) || index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {photo ? (
                      <img src={photo} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 font-heading text-sm font-bold text-primary"
                      >
                        {String(member?.name || '?').charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="font-medium text-ink">{member?.name || '—'}</span>
                  </div>
                </TableCell>
                <TableCell>{titleCase(member?.designation) || '—'}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {member?.experience_years != null ? `${member.experience_years} yrs` : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex max-w-[200px] flex-wrap gap-1">
                    {(member?.languages || []).length
                      ? member.languages.map((language) => (
                          <Badge key={language} variant="neutral" className="px-2 py-0.5 text-[11px]">
                            {titleCase(language)}
                          </Badge>
                        ))
                      : '—'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={availability?.color || 'neutral'}>
                    {availability?.label || titleCase(member?.availability_status || 'Unknown')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <Star className="h-4 w-4 fill-warning text-warning" aria-hidden="true" />
                    {Number.isFinite(rating) && member?.rating != null ? rating.toFixed(1) : '—'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(member)}
                      aria-label={`Edit ${member?.name || 'staff member'}`}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmTarget(member)}
                      aria-label={`Delete ${member?.name || 'staff member'}`}
                      className="text-accent hover:bg-red-50 hover:text-accent"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        title="Remove staff member?"
      >
        <p className="text-sm text-ink-light">
          This will permanently remove <strong className="text-ink">{confirmTarget?.name || 'this staff member'}</strong>{' '}
          from the roster. This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirmTarget(null)}>
            Cancel
          </Button>
          <Button variant="accent" onClick={confirmDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  )
}
