import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, RefreshCw, Star, Trash2 } from 'lucide-react'
import Seo from '@/components/common/Seo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { adminService } from '@/services/adminService'
import { apiErrorMessage } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/utils/cn'
import { formatDate, titleCase, truncate } from '@/utils/formatters'

const CONTACT_STATUSES = ['new', 'contacted', 'converted', 'closed']

const asList = (data, ...keys) => {
  if (Array.isArray(data)) return data
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key]
  }
  return []
}

const idOf = (record) => record?.id || record?._id

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

function SectionError({ detail, onRetry }) {
  return (
    <div className="py-6 text-center">
      <p className="text-sm font-medium text-ink">Could not reach the server — is the backend running?</p>
      {detail && <p className="mt-1 text-xs text-ink-light">{detail}</p>}
      <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  )
}

/** Admin settings: profile, notification preferences, testimonial moderation, inquiries. */
export default function Settings() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [notifications, setNotifications] = useState({ whatsapp: true, sms: true, email: true })

  const [testimonials, setTestimonials] = useState({ loading: true, error: null, items: [] })
  const [contacts, setContacts] = useState({ loading: true, error: null, items: [] })

  const loadTestimonials = useCallback(async () => {
    setTestimonials({ loading: true, error: null, items: [] })
    try {
      const data = await adminService.listTestimonials()
      setTestimonials({ loading: false, error: null, items: asList(data, 'testimonials', 'items', 'results') })
    } catch (err) {
      setTestimonials({ loading: false, error: apiErrorMessage(err), items: [] })
    }
  }, [])

  const loadContacts = useCallback(async () => {
    setContacts({ loading: true, error: null, items: [] })
    try {
      const data = await adminService.listContacts()
      setContacts({ loading: false, error: null, items: asList(data, 'contacts', 'inquiries', 'items', 'results') })
    } catch (err) {
      setContacts({ loading: false, error: apiErrorMessage(err), items: [] })
    }
  }, [])

  useEffect(() => {
    loadTestimonials()
    loadContacts()
  }, [loadTestimonials, loadContacts])

  const toggleNotification = (key) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      toast.info(`${titleCase(key)} confirmations ${next[key] ? 'enabled' : 'disabled'}`)
      return next
    })
  }

  const approveTestimonial = async (testimonial) => {
    try {
      await adminService.approveTestimonial(idOf(testimonial))
      toast.success('Testimonial approved')
      loadTestimonials()
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not approve testimonial.'))
    }
  }

  const deleteTestimonial = async (testimonial) => {
    try {
      await adminService.deleteTestimonial(idOf(testimonial))
      toast.success('Testimonial deleted')
      loadTestimonials()
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not delete testimonial.'))
    }
  }

  const updateContactStatus = async (contact, status) => {
    try {
      await adminService.updateContact(idOf(contact), { status })
      toast.success(`Inquiry marked ${titleCase(status).toLowerCase()}`)
      loadContacts()
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not update inquiry.'))
    }
  }

  return (
    <>
      <Seo title="Admin — Settings" />
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-ink-light">Profile, notifications, testimonials and inquiries</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your admin account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-light">Name</p>
                <p className="mt-1 text-sm font-medium text-ink">{user?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-light">Email</p>
                <p className="mt-1 text-sm font-medium text-ink">{user?.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-light">Role</p>
                <p className="mt-1">
                  <Badge variant="secondary">{titleCase(user?.role || 'admin')}</Badge>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Connected to backend notification service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              <ToggleSwitch
                label="WhatsApp confirmations"
                description="Send booking confirmations and reminders on WhatsApp"
                checked={notifications.whatsapp}
                onChange={() => toggleNotification('whatsapp')}
              />
              <ToggleSwitch
                label="SMS confirmations"
                description="Send booking confirmations and 24-hour reminders by SMS"
                checked={notifications.sms}
                onChange={() => toggleNotification('sms')}
              />
              <ToggleSwitch
                label="Email confirmations"
                description="Send welcome emails, confirmations and care plan documents"
                checked={notifications.email}
                onChange={() => toggleNotification('email')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Testimonials moderation */}
        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>Approve or remove reviews before they appear on the website</CardDescription>
          </CardHeader>
          <CardContent>
            {testimonials.loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : testimonials.error ? (
              <SectionError detail={testimonials.error} onRetry={loadTestimonials} />
            ) : testimonials.items.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-light">No records yet</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {testimonials.items.map((testimonial, index) => {
                  const approved = testimonial?.status === 'approved' || testimonial?.approved === true
                  return (
                    <li
                      key={idOf(testimonial) || index}
                      className="flex flex-wrap items-start justify-between gap-3 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-ink">{testimonial?.name || 'Anonymous'}</p>
                          {testimonial?.rating != null && (
                            <span className="inline-flex items-center gap-0.5 text-xs text-ink-light">
                              <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
                              {testimonial.rating}
                            </span>
                          )}
                          <Badge variant={approved ? 'success' : 'warning'}>
                            {approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-ink-light">
                          {truncate(testimonial?.text || testimonial?.message || testimonial?.review, 140) || '—'}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        {!approved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => approveTestimonial(testimonial)}
                            aria-label={`Approve testimonial from ${testimonial?.name || 'anonymous'}`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTestimonial(testimonial)}
                          aria-label={`Delete testimonial from ${testimonial?.name || 'anonymous'}`}
                          className="text-accent hover:bg-red-50 hover:text-accent"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Contact inquiries */}
        <Card>
          <CardHeader>
            <CardTitle>Contact inquiries</CardTitle>
            <CardDescription>Follow up on messages from the contact form</CardDescription>
          </CardHeader>
          <CardContent>
            {contacts.loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : contacts.error ? (
              <SectionError detail={contacts.error} onRetry={loadContacts} />
            ) : contacts.items.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-light">No records yet</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {contacts.items.map((contact, index) => (
                  <li
                    key={idOf(contact) || index}
                    className="flex flex-wrap items-start justify-between gap-3 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-ink">{contact?.name || '—'}</p>
                        <span className="text-xs text-ink-light">{contact?.phone || '—'}</span>
                        <span className="text-xs text-ink-light">
                          {formatDate(contact?.created_at || contact?.createdAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-light">
                        {titleCase(contact?.service_interested || contact?.service || 'General inquiry')}
                      </p>
                      {(contact?.message || contact?.text) && (
                        <p className="mt-1 text-sm text-ink-light">
                          {truncate(contact?.message || contact?.text, 90)}
                        </p>
                      )}
                    </div>
                    <div className="w-40 shrink-0">
                      <Select
                        value={contact?.status || 'new'}
                        onChange={(event) => updateContactStatus(contact, event.target.value)}
                        aria-label={`Update status for inquiry from ${contact?.name || 'unknown'}`}
                        className="h-9 text-xs"
                      >
                        {CONTACT_STATUSES.map((value) => (
                          <option key={value} value={value}>
                            {titleCase(value)}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
