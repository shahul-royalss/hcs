import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/useToast'
import { contactService } from '@/services/contactService'
import { apiErrorMessage } from '@/services/api'
import { rules } from '@/utils/validation'
import { services } from '@/data/services'
import { siteConfig } from '@/data/siteConfig'
import { telLink } from '@/utils/helpers'

const CONTACT_TIMES = ['Morning', 'Afternoon', 'Evening', 'Any time']

/** Contact form (architecture doc §10) — posts to /api/contact. */
export default function ContactForm() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service_interested: '',
      message: '',
      preferred_contact_time: 'Any time',
    },
  })

  const onSubmit = async (values) => {
    setSubmitting(true)
    setFailed(false)
    try {
      await contactService.submit({
        name: values.name,
        email: values.email,
        phone: values.phone,
        service_interested: values.service_interested,
        message: values.message,
        preferred_contact_time: values.preferred_contact_time,
      })
      setSubmitted(true)
      toast.success('Message sent — thank you!')
    } catch (e) {
      setFailed(true)
      toast.error(apiErrorMessage(e))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="border-success/30 bg-success-50">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-success" aria-hidden="true" />
          <h3 className="font-heading text-xl font-bold text-primary">Message received!</h3>
          <p className="text-ink-light">
            We received your message — we&rsquo;ll reach out within 2 business hours.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              reset()
              setSubmitted(false)
            }}
          >
            Send another message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name" required>
            Name
          </Label>
          <Input
            id="contact-name"
            placeholder="Your full name"
            autoComplete="name"
            aria-invalid={errors.name ? 'true' : undefined}
            {...register('name', rules.name)}
          />
          {errors.name && <p className="mt-1 text-xs text-accent">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="contact-phone" required>
            Phone
          </Label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="10-digit mobile number"
            autoComplete="tel"
            aria-invalid={errors.phone ? 'true' : undefined}
            {...register('phone', rules.phone)}
          />
          {errors.phone && <p className="mt-1 text-xs text-accent">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="contact-email" required>
          Email
        </Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={errors.email ? 'true' : undefined}
          {...register('email', rules.email)}
        />
        {errors.email && <p className="mt-1 text-xs text-accent">{errors.email.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-service" required>
            Service interested in
          </Label>
          <Select
            id="contact-service"
            aria-invalid={errors.service_interested ? 'true' : undefined}
            {...register('service_interested', rules.required('Service'))}
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="General Inquiry">General Inquiry</option>
          </Select>
          {errors.service_interested && (
            <p className="mt-1 text-xs text-accent">{errors.service_interested.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="contact-time">Preferred contact time</Label>
          <Select id="contact-time" {...register('preferred_contact_time')}>
            {CONTACT_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="contact-message" required>
          Message
        </Label>
        <Textarea
          id="contact-message"
          placeholder="Tell us a little about the care you need…"
          aria-invalid={errors.message ? 'true' : undefined}
          {...register('message', rules.message)}
        />
        {errors.message && <p className="mt-1 text-xs text-accent">{errors.message.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
        {submitting ? 'Sending…' : 'Send Message'}
      </Button>

      {failed && (
        <p className="rounded-xl bg-warning-50 px-4 py-3 text-sm text-ink">
          Couldn&rsquo;t send your message right now. You can also reach us directly — call{' '}
          <a href={telLink(siteConfig.phone)} className="font-semibold text-primary underline">
            {siteConfig.phoneDisplay}
          </a>{' '}
          or message us on WhatsApp.
        </p>
      )}
    </form>
  )
}
