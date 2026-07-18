import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImageOff, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import Seo from '@/components/common/Seo'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { serviceService } from '@/services/serviceService'
import { adminService } from '@/services/adminService'
import { apiErrorMessage } from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { titleCase, truncate } from '@/utils/formatters'

const CATEGORIES = ['facilities', 'daily_activities', 'care_programs', 'events', 'team', 'day_care']

const asList = (data, ...keys) => {
  if (Array.isArray(data)) return data
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key]
  }
  return []
}

const idOf = (image) => image?.id || image?._id
const urlOf = (image) => image?.image_url || image?.url

function GalleryFormDialog({ open, image, onClose, onSaved }) {
  const { toast } = useToast()
  const editing = Boolean(image)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (open) {
      reset({
        title: image?.title || '',
        image_url: urlOf(image) || '',
        category: image?.category || 'facilities',
        description: image?.description || '',
      })
    }
  }, [open, image, reset])

  const onSubmit = async (values) => {
    try {
      if (editing) {
        await adminService.updateGalleryImage(idOf(image), values)
        toast.success('Image updated')
      } else {
        await adminService.uploadGalleryImage(values)
        toast.success('Image added to gallery')
      }
      onSaved()
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not save image.'))
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={editing ? 'Edit image' : 'Add image'}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">
          <div>
            <Label htmlFor="gallery-title" required>
              Title
            </Label>
            <Input
              id="gallery-title"
              placeholder="e.g. Physiotherapy session"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="mt-1 text-xs text-accent">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="gallery-url" required>
              Image URL
            </Label>
            <Input
              id="gallery-url"
              placeholder="https://… or /images/gallery/…"
              {...register('image_url', {
                required: 'Image URL is required',
                pattern: {
                  value: /^(https?:\/\/|\/)\S+$/,
                  message: 'Enter a valid URL (https://…) or site path (/images/…)',
                },
              })}
            />
            {errors.image_url && <p className="mt-1 text-xs text-accent">{errors.image_url.message}</p>}
          </div>

          <div>
            <Label htmlFor="gallery-category" required>
              Category
            </Label>
            <Select id="gallery-category" {...register('category', { required: 'Category is required' })}>
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {titleCase(value)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="gallery-description">Description</Label>
            <Textarea
              id="gallery-description"
              placeholder="Short description shown in the lightbox…"
              className="min-h-[80px]"
              {...register('description')}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : editing ? 'Save changes' : 'Add image'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

/** Gallery management: add, edit and delete images (referenced by URL). */
export default function Gallery() {
  const { toast } = useToast()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingImage, setEditingImage] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await serviceService.listGallery()
      setImages(asList(data, 'images', 'gallery', 'items', 'results'))
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const confirmDelete = async () => {
    const target = deleteTarget
    setDeleteTarget(null)
    try {
      await adminService.deleteGalleryImage(idOf(target))
      toast.success('Image deleted')
      load()
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not delete image.'))
    }
  }

  return (
    <>
      <Seo title="Admin — Gallery" />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Gallery</h1>
          <p className="text-sm text-ink-light">
            Images are referenced by URL; object storage upload can be connected later.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingImage(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="font-medium text-ink">Could not reach the server — is the backend running?</p>
          <p className="mt-1 text-sm text-ink-light">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={load}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </Card>
      ) : images.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-ink-light">No records yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <Card key={idOf(image) || index} className="overflow-hidden">
              {urlOf(image) ? (
                <img src={urlOf(image)} alt={image?.title || 'Gallery image'} className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 w-full items-center justify-center bg-surface text-ink-light">
                  <ImageOff className="h-8 w-8" aria-hidden="true" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-medium text-ink">{image?.title || 'Untitled'}</p>
                  <Badge variant="secondary" className="shrink-0">
                    {titleCase(image?.category || 'General')}
                  </Badge>
                </div>
                {image?.description && (
                  <p className="mt-1 text-xs text-ink-light">{truncate(image.description, 70)}</p>
                )}
                <div className="mt-3 flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingImage(image)
                      setFormOpen(true)
                    }}
                    aria-label={`Edit ${image?.title || 'image'}`}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(image)}
                    aria-label={`Delete ${image?.title || 'image'}`}
                    className="text-accent hover:bg-red-50 hover:text-accent"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <GalleryFormDialog
        open={formOpen}
        image={editingImage}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false)
          load()
        }}
      />

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete image?">
        <p className="text-sm text-ink-light">
          This will remove <strong className="text-ink">{deleteTarget?.title || 'this image'}</strong> from the
          gallery. This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
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
