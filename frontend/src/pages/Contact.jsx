import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AlertCircle, CheckCircle2, FileText, Loader2, PhoneCall, Zap } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/common/AnimatedSection'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'
import MapEmbed from '@/components/contact/MapEmbed'
import ServiceAreaChecker from '@/components/contact/ServiceAreaChecker'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog } from '@/components/ui/dialog'
import { useToast } from '@/hooks/useToast'
import { contactService } from '@/services/contactService'
import { apiErrorMessage } from '@/services/api'
import { rules } from '@/utils/validation'
import { siteConfig } from '@/data/siteConfig'
import { telLink } from '@/utils/helpers'
import { cn } from '@/utils/cn'

/** Small dialog form for requesting a callback (§10 Quick Actions). */
function CallbackDialogForm({ onDone }) {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: '', phone: '' } })

  const onSubmit = async (values) => {
    setSubmitting(true)
    setFailed(false)
    try {
      await contactService.requestCallback({ name: values.name, phone: values.phone })
      setSubmitted(true)
      toast.success('Callback requested!')
    } catch (e) {
      setFailed(true)
      toast.error(apiErrorMessage(e))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
        <p className="font-heading text-lg font-bold text-primary">We&rsquo;ll call you back shortly!</p>
        <p className="text-sm text-ink-light">Keep your phone nearby — a coordinator is on it.</p>
        <Button variant="outline" onClick={onDone}>
          Done
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <Label htmlFor="callback-name" required>
          Name
        </Label>
        <Input
          id="callback-name"
          placeholder="Your name"
          autoFocus
          autoComplete="name"
          aria-invalid={errors.name ? 'true' : undefined}
          {...register('name', rules.name)}
        />
        {errors.name && <p className="mt-1 text-xs text-accent">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="callback-phone" required>
          Phone number
        </Label>
        <Input
          id="callback-phone"
          type="tel"
          placeholder="10-digit mobile number"
          autoComplete="tel"
          aria-invalid={errors.phone ? 'true' : undefined}
          {...register('phone', rules.phone)}
        />
        {errors.phone && <p className="mt-1 text-xs text-accent">{errors.phone.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
        {submitting ? 'Requesting…' : 'Request Callback'}
      </Button>
      {failed && (
        <p className="flex items-start gap-2 rounded-xl bg-warning-50 px-3 py-2 text-xs text-ink">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
          Couldn&rsquo;t reach the server — call us directly at{' '}
          <a href={telLink(siteConfig.phone)} className="font-semibold text-primary underline">
            {siteConfig.phoneDisplay}
          </a>
        </p>
      )}
    </form>
  )
}

function QuickActions() {
  const [callbackOpen, setCallbackOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Shortcuts for when you need us fast.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="secondary" className="w-full justify-start" onClick={() => setCallbackOpen(true)}>
          <PhoneCall aria-hidden="true" /> Request a callback
        </Button>

        <Link
          to="/emergency"
          className={cn(buttonVariants({ variant: 'accent', size: 'md' }), 'w-full justify-start')}
        >
          <Zap aria-hidden="true" /> Book emergency service
        </Link>

        <div>
          <a
            href={`mailto:${siteConfig.email}?subject=Brochure%20request`}
            className={cn(buttonVariants({ variant: 'outline', size: 'md' }), 'w-full justify-start')}
          >
            <FileText aria-hidden="true" /> Request brochure by email
          </a>
          <p className="mt-1.5 pl-1 text-xs text-ink-light">
            Company profile PDF — sent to your inbox.
          </p>
        </div>
      </CardContent>

      <Dialog open={callbackOpen} onClose={() => setCallbackOpen(false)} title="Request a callback">
        <CallbackDialogForm onDone={() => setCallbackOpen(false)} />
      </Dialog>
    </Card>
  )
}

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact Us"
        description="Contact Dhrishta Healthcare Services in Chittoor — call, WhatsApp, email or visit us. Check your service area and request a callback."
      />
      <PageHeader
        title="Contact Us"
        subtitle="Questions about care at home? Talk to a real person — we're available 24/7."
        crumbs={[{ label: 'Contact Us' }]}
      />

      <section className="section-padding">
        <div className="container-site space-y-12">
          <AnimatedSection>
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="mb-4 font-heading text-2xl font-bold text-primary">Send us a message</h2>
                <ContactForm />
              </div>
              <div>
                <h2 className="mb-4 font-heading text-2xl font-bold text-primary">Reach us directly</h2>
                <ContactInfo />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <MapEmbed />
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid gap-8 lg:grid-cols-2">
              <ServiceAreaChecker />
              <QuickActions />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
