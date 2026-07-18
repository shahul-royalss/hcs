import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  PhoneCall,
  Send,
  Siren,
  UserCheck,
} from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/common/AnimatedSection'
import CallButton from '@/components/common/CallButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { contactService } from '@/services/contactService'
import { apiErrorMessage } from '@/services/api'
import { rules } from '@/utils/validation'
import { siteConfig } from '@/data/siteConfig'
import { telLink } from '@/utils/helpers'

const RESPONSE_STEPS = [
  {
    icon: PhoneCall,
    title: '1. You reach us',
    text: 'Call, WhatsApp or submit this form — our 24/7 line is answered by a real coordinator.',
  },
  {
    icon: UserCheck,
    title: '2. We triage & dispatch',
    text: 'We assess the situation, guide you on immediate steps and dispatch the nearest available nurse or caregiver.',
  },
  {
    icon: Siren,
    title: '3. Care arrives fast',
    text: 'Our professional reaches your home, stabilises the routine and coordinates with your doctor as needed.',
  },
]

export default function Emergency() {
  const { toast } = useToast()
  const { openChat } = useWhatsApp()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: '', phone: '', location: '', description: '' } })

  const onSubmit = async (values) => {
    setSubmitting(true)
    setFailed(false)
    try {
      await contactService.emergency({
        name: values.name,
        phone: values.phone,
        location: values.location,
        description: values.description,
      })
      setSubmitted(true)
    } catch (e) {
      setFailed(true)
      toast.error(apiErrorMessage(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo
        title="Emergency Care Request"
        description="Request urgent home-care support from Dhrishta Healthcare, 24/7. For life-threatening emergencies, always call 108 first."
      />
      <PageHeader
        title="Emergency Care Request"
        subtitle="Urgent home-care support, 24 hours a day — tell us what's happening and we'll move fast."
        crumbs={[{ label: 'Emergency' }]}
      />

      {/* Honest disclaimer band */}
      <div className="bg-accent text-white">
        <div className="container-site flex flex-col items-center gap-2 py-4 text-center sm:flex-row sm:justify-center sm:gap-3">
          <AlertTriangle className="h-6 w-6 shrink-0" aria-hidden="true" />
          <p className="font-heading font-bold">
            For life-threatening emergencies (chest pain, severe bleeding, unconsciousness), call{' '}
            <a href="tel:108" className="underline decoration-2 underline-offset-2">
              108
            </a>{' '}
            immediately. Dhrishta provides urgent home-care support — not an ambulance service.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-site">
          <AnimatedSection>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
              <CallButton size="lg" label={`Call our 24/7 line — ${siteConfig.phoneDisplay}`} />
              <Button
                variant="whatsapp"
                size="lg"
                onClick={() => openChat('EMERGENCY: need immediate care')}
              >
                <MessageCircle aria-hidden="true" /> WhatsApp: EMERGENCY
              </Button>
              <p className="text-sm text-ink-light">
                Fastest response is by phone. If you can&rsquo;t call right now, use the form below.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Card className="mx-auto mt-10 max-w-2xl border-accent/20">
              <CardContent className="p-6 md:p-8">
                {submitted ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center" role="status">
                    <CheckCircle2 className="h-14 w-14 text-success" aria-hidden="true" />
                    <h2 className="font-heading text-xl font-bold text-primary">
                      Our emergency team has been alerted
                    </h2>
                    <p className="max-w-md text-ink-light">
                      Keep your phone reachable — we&rsquo;ll call within 15 minutes. If the
                      situation worsens, call 108 without waiting for us.
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-3">
                      <CallButton />
                      <Button
                        variant="outline"
                        onClick={() => {
                          reset()
                          setSubmitted(false)
                        }}
                      >
                        Submit another request
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    <h2 className="font-heading text-xl font-bold text-primary">
                      Quick emergency form
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="em-name" required>
                          Name
                        </Label>
                        <Input
                          id="em-name"
                          placeholder="Your name"
                          autoComplete="name"
                          aria-invalid={errors.name ? 'true' : undefined}
                          {...register('name', rules.name)}
                        />
                        {errors.name && <p className="mt-1 text-xs text-accent">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="em-phone" required>
                          Phone
                        </Label>
                        <Input
                          id="em-phone"
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
                      <Label htmlFor="em-location" required>
                        Location / address
                      </Label>
                      <Textarea
                        id="em-location"
                        className="min-h-[80px]"
                        placeholder="Where should we come? House, street, landmark, area…"
                        aria-invalid={errors.location ? 'true' : undefined}
                        {...register('location', rules.required('Location'))}
                      />
                      {errors.location && (
                        <p className="mt-1 text-xs text-accent">{errors.location.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="em-description" required>
                        What&rsquo;s happening?
                      </Label>
                      <Textarea
                        id="em-description"
                        placeholder="Briefly describe the situation and the patient's condition…"
                        aria-invalid={errors.description ? 'true' : undefined}
                        {...register('description', rules.required('A brief description'))}
                      />
                      {errors.description && (
                        <p className="mt-1 text-xs text-accent">{errors.description.message}</p>
                      )}
                    </div>
                    <Button type="submit" variant="accent" size="lg" disabled={submitting} className="w-full">
                      {submitting ? (
                        <Loader2 className="animate-spin" aria-hidden="true" />
                      ) : (
                        <Send aria-hidden="true" />
                      )}
                      {submitting ? 'Sending…' : 'Send Emergency Request'}
                    </Button>
                    {failed && (
                      <div className="rounded-xl border border-warning/30 bg-warning-50 p-4" role="alert">
                        <p className="text-sm font-semibold text-ink">
                          The form couldn&rsquo;t reach our server — please don&rsquo;t wait.
                        </p>
                        <p className="mt-1 text-sm text-ink-light">
                          Call us right now at{' '}
                          <a
                            href={telLink(siteConfig.phone)}
                            className="font-semibold text-primary underline"
                          >
                            {siteConfig.phoneDisplay}
                          </a>{' '}
                          or send the WhatsApp message above.
                        </p>
                      </div>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="mx-auto mt-16 max-w-4xl">
              <h2 className="mb-8 text-center font-heading text-2xl font-bold text-primary">
                How our emergency response works
              </h2>
              <div className="grid gap-5 sm:grid-cols-3">
                {RESPONSE_STEPS.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="rounded-card border border-slate-100 bg-white p-6 text-center shadow-card"
                  >
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-accent">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 font-heading font-bold text-primary">{title}</h3>
                    <p className="mt-2 text-sm text-ink-light">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
