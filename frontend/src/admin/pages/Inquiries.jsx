import { useCallback, useEffect, useMemo, useState } from 'react'
import { Eye, Mail, Phone, RefreshCw, Search } from 'lucide-react'
import Seo from '@/components/common/Seo'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { adminService } from '@/services/adminService'
import { apiErrorMessage } from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { formatDateTime, truncate } from '@/utils/formatters'
import { telLink } from '@/utils/helpers'
import { cn } from '@/utils/cn'

const STATUSES = ['new', 'contacted', 'converted', 'closed']
const STATUS_BADGE = { new: 'warning', contacted: 'primary', converted: 'success', closed: 'neutral' }

/** Contact-inquiry pipeline: filter, follow up, annotate and resolve. */
export default function Inquiries() {
  const { toast } = useToast()
  const [inquiries, setInquiries] = useState(null)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [viewing, setViewing] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await adminService.listContacts()
      setInquiries(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(apiErrorMessage(e, 'Could not load inquiries.'))
      setInquiries([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    let list = inquiries || []
    if (filter !== 'all') list = list.filter((i) => i.status === filter)
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter((i) =>
        [i.name, i.phone, i.email, i.service_interested]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    }
    return list
  }, [inquiries, filter, query])

  const counts = useMemo(() => {
    const base = { all: inquiries?.length || 0 }
    for (const s of STATUSES) base[s] = (inquiries || []).filter((i) => i.status === s).length
    return base
  }, [inquiries])

  const updateStatus = async (inquiry, status) => {
    try {
      await adminService.updateContact(inquiry.id, { status })
      toast.success(`Marked as ${status}`)
      await load()
    } catch (e) {
      toast.error(apiErrorMessage(e))
    }
  }

  if (inquiries === null) return <LoadingSpinner fullPage label="Loading inquiries…" />

  return (
    <>
      <Seo title="Admin — Inquiries" description="Contact-form inquiries and follow-up pipeline." />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-primary">Inquiries</h1>
          <p className="text-sm text-ink-light">
            Messages from the contact form, callback requests and emergency requests.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} aria-label="Refresh list">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {['all', ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors',
                filter === s ? 'bg-primary text-white' : 'bg-white text-ink-light hover:text-primary'
              )}
            >
              {s} ({counts[s] ?? 0})
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, email…"
            className="pl-10"
            aria-label="Search inquiries"
          />
        </div>
      </div>

      {error && (
        <Card className="mb-5 border-warning/40 bg-warning-50 p-4 text-sm text-ink">
          {error} — is the backend (and MongoDB) running?
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card className="p-10 text-center text-ink-light">No inquiries found.</Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Interested In</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell className="font-semibold text-ink">{inquiry.name || '—'}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5 text-xs">
                    {inquiry.phone && (
                      <a href={telLink(inquiry.phone)} className="inline-flex items-center gap-1 text-secondary hover:underline">
                        <Phone className="h-3 w-3" /> {inquiry.phone}
                      </a>
                    )}
                    {inquiry.email && (
                      <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-1 text-ink-light hover:underline">
                        <Mail className="h-3 w-3" /> {inquiry.email}
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>{inquiry.service_interested || '—'}</TableCell>
                <TableCell className="max-w-[220px] text-ink-light">
                  {truncate(inquiry.message, 60) || '—'}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-ink-light">
                  {formatDateTime(inquiry.created_at)}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE[inquiry.status] || 'neutral'}>{inquiry.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => setViewing(inquiry)}>
                    <Eye className="h-4 w-4" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <InquiryDialog
        key={viewing?.id || 'closed'}
        inquiry={viewing}
        onClose={() => setViewing(null)}
        onChanged={load}
        onStatus={updateStatus}
      />
    </>
  )
}

/** Full inquiry detail with status + internal notes. */
function InquiryDialog({ inquiry, onClose, onChanged, onStatus }) {
  const { toast } = useToast()
  const [notes, setNotes] = useState(inquiry?.notes || '')
  const [saving, setSaving] = useState(false)

  if (!inquiry) return null

  const saveNotes = async () => {
    setSaving(true)
    try {
      await adminService.updateContact(inquiry.id, { notes })
      toast.success('Notes saved')
      onChanged()
    } catch (e) {
      toast.error(apiErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onClose={onClose} title={`Inquiry — ${inquiry.name || 'Unknown'}`} className="max-w-xl">
      <div className="space-y-4 text-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow label="Phone" value={inquiry.phone} href={inquiry.phone ? telLink(inquiry.phone) : undefined} />
          <InfoRow label="Email" value={inquiry.email} href={inquiry.email ? `mailto:${inquiry.email}` : undefined} />
          <InfoRow label="Interested in" value={inquiry.service_interested} />
          <InfoRow label="Preferred time" value={inquiry.preferred_contact_time} />
          <InfoRow label="Received" value={formatDateTime(inquiry.created_at)} />
        </div>

        <div>
          <p className="mb-1 font-semibold text-ink">Message</p>
          <p className="whitespace-pre-wrap rounded-xl bg-surface p-3 leading-relaxed text-ink-light">
            {inquiry.message || '—'}
          </p>
        </div>

        <div>
          <Label htmlFor="inq-status">Status</Label>
          <Select
            id="inq-status"
            defaultValue={inquiry.status}
            onChange={(e) => onStatus(inquiry, e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="inq-notes">Internal notes</Label>
          <Textarea
            id="inq-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Follow-up details, call summary…"
          />
          <div className="mt-2 flex justify-end">
            <Button size="sm" onClick={saveNotes} disabled={saving}>
              {saving ? 'Saving…' : 'Save Notes'}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

function InfoRow({ label, value, href }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-light">{label}</p>
      {href && value ? (
        <a href={href} className="font-medium text-secondary hover:underline">
          {value}
        </a>
      ) : (
        <p className="font-medium text-ink">{value || '—'}</p>
      )}
    </div>
  )
}
