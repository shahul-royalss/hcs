import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Check, Pencil, Plus, RefreshCw, ShieldCheck, Star, Trash2, X } from 'lucide-react'
import Seo from '@/components/common/Seo'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StarRating from '@/components/common/StarRating'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { adminService } from '@/services/adminService'
import { apiErrorMessage } from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { services } from '@/data/services'
import { formatDate } from '@/utils/formatters'
import { cn } from '@/utils/cn'

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
]

const STATUS_BADGE = { pending: 'warning', approved: 'success', rejected: 'accent' }

const EMPTY_FORM = { customer_name: '', service_used: '', rating: 5, review: '' }

/** Reviews moderation: approve/reject, feature, edit, add and delete. */
export default function Reviews() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState(null)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null) // review object or 'new'
  const [deleting, setDeleting] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await adminService.listTestimonials()
      setReviews(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(apiErrorMessage(e, 'Could not load reviews.'))
      setReviews([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    if (!reviews) return []
    return filter === 'all' ? reviews : reviews.filter((r) => r.status === filter)
  }, [reviews, filter])

  const counts = useMemo(() => {
    const base = { all: reviews?.length || 0, pending: 0, approved: 0, rejected: 0 }
    for (const r of reviews || []) base[r.status] = (base[r.status] || 0) + 1
    return base
  }, [reviews])

  const act = async (id, fn, successMsg) => {
    setBusyId(id)
    try {
      await fn()
      toast.success(successMsg)
      await load()
    } catch (e) {
      toast.error(apiErrorMessage(e))
    } finally {
      setBusyId(null)
    }
  }

  const approve = (r) => act(r.id, () => adminService.approveTestimonial(r.id), 'Review approved')
  const reject = (r) =>
    act(r.id, () => adminService.updateTestimonial(r.id, { status: 'rejected' }), 'Review rejected')
  const toggleFeatured = (r) =>
    act(
      r.id,
      () => adminService.updateTestimonial(r.id, { is_featured: !r.is_featured }),
      r.is_featured ? 'Removed from featured' : 'Featured on home page'
    )

  if (reviews === null) return <LoadingSpinner fullPage label="Loading reviews…" />

  return (
    <>
      <Seo title="Admin — Reviews" description="Moderate, edit and feature customer reviews." />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-primary">Reviews</h1>
          <p className="text-sm text-ink-light">
            Approve, edit and feature the reviews shown on the website.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} aria-label="Refresh list">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setEditing('new')}>
            <Plus className="h-4 w-4" /> Add Review
          </Button>
        </div>
      </div>

      {/* Status filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              filter === id ? 'bg-primary text-white' : 'bg-white text-ink-light hover:text-primary'
            )}
          >
            {label} ({counts[id] ?? 0})
          </button>
        ))}
      </div>

      {error && (
        <Card className="mb-5 border-warning/40 bg-warning-50 p-4 text-sm text-ink">
          {error} — showing what could be loaded. Is the backend (and MongoDB) running?
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card className="p-10 text-center text-ink-light">
          No {filter === 'all' ? '' : `${filter} `}reviews yet.
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((r) => (
            <Card key={r.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading font-bold text-primary">{r.customer_name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <StarRating rating={r.rating} />
                    <Badge variant={STATUS_BADGE[r.status] || 'neutral'}>{r.status}</Badge>
                    {r.service_used && <Badge variant="primary">{r.service_used}</Badge>}
                    {r.is_featured && <Badge variant="secondary">Featured</Badge>}
                    {r.is_verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-xs text-ink-light">{formatDate(r.created_at)}</span>
              </div>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-light">{r.review}</p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {r.status !== 'approved' && (
                  <Button size="sm" variant="secondary" disabled={busyId === r.id} onClick={() => approve(r)}>
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                )}
                {r.status !== 'rejected' && (
                  <Button size="sm" variant="ghost" disabled={busyId === r.id} onClick={() => reject(r)}>
                    <X className="h-4 w-4" /> Reject
                  </Button>
                )}
                <Button size="sm" variant="ghost" disabled={busyId === r.id} onClick={() => toggleFeatured(r)}>
                  <Star className={cn('h-4 w-4', r.is_featured && 'fill-warning text-warning')} />
                  {r.is_featured ? 'Unfeature' : 'Feature'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(r)}>
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-accent hover:bg-red-50"
                  onClick={() => setDeleting(r)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / edit dialog */}
      <ReviewFormDialog
        key={editing === 'new' ? 'new' : editing?.id || 'closed'}
        review={editing === 'new' ? null : editing}
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          load()
        }}
      />

      {/* Delete confirmation */}
      <Dialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Delete this review?">
        <p className="text-sm text-ink-light">
          The review by <strong className="text-ink">{deleting?.customer_name}</strong> will be
          permanently removed from the website.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button
            variant="accent"
            onClick={() =>
              act(deleting.id, () => adminService.deleteTestimonial(deleting.id), 'Review deleted').then(
                () => setDeleting(null)
              )
            }
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </Dialog>
    </>
  )
}

/** Shared add/edit review form. */
function ReviewFormDialog({ review, open, onClose, onSaved }) {
  const { toast } = useToast()
  const isNew = !review
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: isNew
      ? EMPTY_FORM
      : {
          customer_name: review.customer_name || '',
          service_used: review.service_used || '',
          rating: review.rating ?? 5,
          review: review.review || '',
        },
  })

  const onSubmit = async (values) => {
    const payload = { ...values, rating: Number(values.rating) }
    try {
      if (isNew) {
        await adminService.createTestimonial(payload)
        toast.success('Review added and approved')
      } else {
        await adminService.updateTestimonial(review.id, payload)
        toast.success('Review updated')
      }
      onSaved()
    } catch (e) {
      toast.error(apiErrorMessage(e))
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={isNew ? 'Add Review' : 'Edit Review'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="rev-name" required>
            Customer name
          </Label>
          <Input
            id="rev-name"
            aria-invalid={Boolean(errors.customer_name)}
            {...register('customer_name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
          />
          {errors.customer_name && (
            <p className="mt-1 text-xs text-accent">{errors.customer_name.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="rev-service">Service used</Label>
            <Select id="rev-service" {...register('service_used')}>
              <option value="">— None —</option>
              {services.map((s) => (
                <option key={s.slug} value={s.shortName}>
                  {s.shortName}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="rev-rating" required>
              Rating
            </Label>
            <Select id="rev-rating" {...register('rating', { required: true })}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? 's' : ''}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="rev-text" required>
            Review
          </Label>
          <Textarea
            id="rev-text"
            aria-invalid={Boolean(errors.review)}
            {...register('review', { required: 'Review text is required', minLength: { value: 5, message: 'Too short' } })}
          />
          {errors.review && <p className="mt-1 text-xs text-accent">{errors.review.message}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : isNew ? 'Add Review' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
