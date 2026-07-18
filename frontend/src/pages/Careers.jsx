import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AlertCircle, Briefcase, CheckCircle2, Loader2, Mail, MapPin, Send } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import ServiceIcon from '@/components/common/ServiceIcon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'
import { contactService } from '@/services/contactService'
import { apiErrorMessage } from '@/services/api'
import { rules } from '@/utils/validation'
import { openings, benefits } from '@/data/careers'
import { siteConfig } from '@/data/siteConfig'
import { telLink } from '@/utils/helpers'

/** Job application form rendered inside the Apply dialog. */
function ApplicationForm({ position, onDone }) {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', phone: '', email: '', position, experienceYears: '', message: '' },
  })

  const onSubmit = async (values) => {
    setSubmitting(true)
    setFailed(false)
    const details = [
      values.experienceYears !== '' ? `Experience: ${values.experienceYears} years.` : '',
      values.message,
    ]
      .filter(Boolean)
      .join('\n')
    try {
      await contactService.submit({
        name: values.name,
        email: values.email,
        phone: values.phone,
        service_interested: `Career: ${values.position}`,
        message: details || `Application for ${values.position}`,
        preferred_contact_time: 'Any time',
      })
      setSubmitted(true)
      toast.success('Application submitted!')
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
        <p className="font-heading text-lg font-bold text-primary">Application received!</p>
        <p className="text-sm text-ink-light">
          Our HR team will review it and call you within 2 business days.
        </p>
        <Button variant="outline" onClick={onDone}>
          Done
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="apply-name" required>
            Name
          </Label>
          <Input
            id="apply-name"
            placeholder="Your full name"
            autoFocus
            autoComplete="name"
            aria-invalid={errors.name ? 'true' : undefined}
            {...register('name', rules.name)}
          />
          {errors.name && <p className="mt-1 text-xs text-accent">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="apply-phone" required>
            Phone
          </Label>
          <Input
            id="apply-phone"
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
        <Label htmlFor="apply-email" required>
          Email
        </Label>
        <Input
          id="apply-email"
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
          <Label htmlFor="apply-position" required>
            Position
          </Label>
          <Select id="apply-position" {...register('position', rules.required('Position'))}>
            {openings.map((job) => (
              <option key={job.id} value={job.title}>
                {job.title}
              </option>
            ))}
          </Select>
          {errors.position && <p className="mt-1 text-xs text-accent">{errors.position.message}</p>}
        </div>
        <div>
          <Label htmlFor="apply-experience">Experience (years)</Label>
          <Input
            id="apply-experience"
            type="number"
            min={0}
            max={50}
            placeholder="e.g. 3"
            {...register('experienceYears')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="apply-message">Message</Label>
        <Textarea
          id="apply-message"
          placeholder="A few lines about yourself, qualifications and availability…"
          {...register('message')}
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
        {submitting ? 'Submitting…' : 'Submit Application'}
      </Button>

      {failed && (
        <p className="flex items-start gap-2 rounded-xl bg-warning-50 px-3 py-2 text-xs text-ink">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
          Couldn&rsquo;t submit online — call us at{' '}
          <a href={telLink(siteConfig.phone)} className="font-semibold text-primary underline">
            {siteConfig.phoneDisplay}
          </a>{' '}
          or email your resume to{' '}
          <a href={`mailto:${siteConfig.email}`} className="font-semibold text-primary underline">
            {siteConfig.email}
          </a>
        </p>
      )}
    </form>
  )
}

export default function Careers() {
  const [applyingFor, setApplyingFor] = useState(null)

  return (
    <>
      <Seo
        title="Careers"
        description="Join the Dhrishta Healthcare team in Chittoor — nursing, caregiving, physiotherapy and coordination roles with training, insurance and fair pay."
      />
      <PageHeader
        title="Careers at Dhrishta"
        subtitle="Do work that matters, with a team that has your back."
        crumbs={[{ label: 'Careers' }]}
      />

      <section className="section-padding">
        <div className="container-site">
          <AnimatedSection>
            <p className="mx-auto max-w-2xl text-center text-ink-light md:text-lg">
              Every day, our nurses and caregivers help families through their hardest moments.
              If you have the skill and the heart for care, we&rsquo;ll give you the training,
              respect and stability to build a real career out of it.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <SectionHeading
              tagline="Why work with us"
              title="Benefits of joining Dhrishta"
              className="mt-14"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <Card key={benefit.title}>
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary">
                      <ServiceIcon name={benefit.icon} className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-primary">{benefit.title}</h3>
                      <p className="mt-1 text-sm text-ink-light">{benefit.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <SectionHeading tagline="Open positions" title="We're hiring" className="mt-16" />
            <div className="grid gap-6 lg:grid-cols-2">
              {openings.map((job) => (
                <Card key={job.id} className="flex flex-col">
                  <CardContent className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-lg font-bold text-primary">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        <Briefcase className="h-3 w-3" aria-hidden="true" /> {job.type}
                      </Badge>
                      <Badge variant="primary">
                        <MapPin className="h-3 w-3" aria-hidden="true" /> {job.location}
                      </Badge>
                      <Badge variant="neutral">{job.experience}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-ink-light">{job.description}</p>
                    <ul className="mt-4 flex-1 space-y-1.5">
                      {job.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2 text-sm text-ink">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                          {req}
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-5 self-start" onClick={() => setApplyingFor(job)}>
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="mt-14 rounded-card bg-primary-50 p-8 text-center">
              <Mail className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
              <h2 className="mt-3 font-heading text-xl font-bold text-primary">
                Don&rsquo;t see your role?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-light">
                We&rsquo;re always looking for good people. Send your resume to{' '}
                <a
                  href={`mailto:${siteConfig.email}?subject=Job%20application`}
                  className="font-semibold text-secondary underline"
                >
                  {siteConfig.email}
                </a>{' '}
                and tell us what you&rsquo;d love to do.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Dialog
        open={!!applyingFor}
        onClose={() => setApplyingFor(null)}
        title={applyingFor ? `Apply — ${applyingFor.title}` : 'Apply'}
      >
        {applyingFor && (
          <ApplicationForm position={applyingFor.title} onDone={() => setApplyingFor(null)} />
        )}
      </Dialog>
    </>
  )
}
