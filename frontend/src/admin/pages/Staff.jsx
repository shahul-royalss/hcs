import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, RefreshCw } from 'lucide-react'
import Seo from '@/components/common/Seo'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import StaffTable from '@/admin/components/StaffTable'
import { adminService } from '@/services/adminService'
import { apiErrorMessage } from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { rules } from '@/utils/validation'
import { titleCase } from '@/utils/formatters'

const DESIGNATIONS = ['doctor', 'nurse', 'caregiver', 'physiotherapist', 'support_staff']
const GENDERS = ['female', 'male', 'other']
const AVAILABILITY_OPTIONS = ['available', 'assigned', 'on_leave']

const asList = (data, ...keys) => {
  if (Array.isArray(data)) return data
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key]
  }
  return []
}

const toArray = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

function StaffFormDialog({ open, member, onClose, onSaved }) {
  const { toast } = useToast()
  const editing = Boolean(member)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (open) {
      reset({
        name: member?.name || '',
        designation: member?.designation || 'caregiver',
        qualifications: member?.qualifications || '',
        experience_years: member?.experience_years ?? '',
        languages: (member?.languages || []).join(', '),
        gender: member?.gender || 'female',
        phone: member?.phone || '',
        email: member?.email || '',
        specializations: (member?.specializations || []).join(', '),
        availability_status: member?.availability_status || 'available',
      })
    }
  }, [open, member, reset])

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      experience_years: Number(values.experience_years) || 0,
      languages: toArray(values.languages),
      specializations: toArray(values.specializations),
    }
    try {
      if (editing) {
        await adminService.updateStaff(member?.id || member?._id, payload)
        toast.success('Staff member updated')
      } else {
        await adminService.createStaff(payload)
        toast.success('Staff member added')
      }
      onSaved()
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not save staff member.'))
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={editing ? 'Edit staff member' : 'Add staff member'} className="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="staff-name" required>
              Full name
            </Label>
            <Input id="staff-name" placeholder="e.g. Lakshmi Devi" {...register('name', rules.name)} />
            {errors.name && <p className="mt-1 text-xs text-accent">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="staff-designation" required>
              Designation
            </Label>
            <Select id="staff-designation" {...register('designation', rules.required('Designation'))}>
              {DESIGNATIONS.map((value) => (
                <option key={value} value={value}>
                  {titleCase(value)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="staff-experience" required>
              Experience (years)
            </Label>
            <Input
              id="staff-experience"
              type="number"
              min="0"
              placeholder="e.g. 5"
              {...register('experience_years', {
                required: 'Experience is required',
                min: { value: 0, message: 'Experience cannot be negative' },
              })}
            />
            {errors.experience_years && (
              <p className="mt-1 text-xs text-accent">{errors.experience_years.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="staff-qualifications">Qualifications</Label>
            <Input
              id="staff-qualifications"
              placeholder="e.g. B.Sc Nursing, ANM"
              {...register('qualifications')}
            />
          </div>

          <div>
            <Label htmlFor="staff-gender" required>
              Gender
            </Label>
            <Select id="staff-gender" {...register('gender', rules.required('Gender'))}>
              {GENDERS.map((value) => (
                <option key={value} value={value}>
                  {titleCase(value)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="staff-availability" required>
              Availability
            </Label>
            <Select id="staff-availability" {...register('availability_status', rules.required('Availability'))}>
              {AVAILABILITY_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {titleCase(value)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="staff-phone" required>
              Phone
            </Label>
            <Input id="staff-phone" type="tel" placeholder="e.g. 9959388374" {...register('phone', rules.phone)} />
            {errors.phone && <p className="mt-1 text-xs text-accent">{errors.phone.message}</p>}
          </div>

          <div>
            <Label htmlFor="staff-email">Email</Label>
            <Input id="staff-email" type="email" placeholder="name@dhrishta.com" {...register('email', rules.emailOptional)} />
            {errors.email && <p className="mt-1 text-xs text-accent">{errors.email.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="staff-languages">Languages (comma-separated)</Label>
            <Input id="staff-languages" placeholder="e.g. Telugu, Tamil, English" {...register('languages')} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="staff-specializations">Specializations (comma-separated)</Label>
            <Input
              id="staff-specializations"
              placeholder="e.g. Elderly care, Post-surgery care"
              {...register('specializations')}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : editing ? 'Save changes' : 'Add staff'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

/** Staff roster management: add, edit and remove healthcare staff. */
export default function Staff() {
  const { toast } = useToast()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.listStaff()
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

  const handleDelete = async (member) => {
    try {
      await adminService.deleteStaff(member?.id || member?._id)
      toast.success('Staff member removed')
      load()
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not remove staff member.'))
    }
  }

  return (
    <>
      <Seo title="Admin — Staff" />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Staff</h1>
          <p className="text-sm text-ink-light">Manage doctors, nurses, caregivers and support staff</p>
        </div>
        <Button
          onClick={() => {
            setEditingMember(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {loading ? (
        <Card className="space-y-3 p-6">
          {[0, 1, 2, 3, 4].map((i) => (
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
          <StaffTable
            staff={staff}
            onEdit={(member) => {
              setEditingMember(member)
              setFormOpen(true)
            }}
            onDelete={handleDelete}
          />
        </Card>
      )}

      <StaffFormDialog
        open={formOpen}
        member={editingMember}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false)
          load()
        }}
      />
    </>
  )
}
