import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, CheckCircle2, Loader2, MapPin, PhoneCall, Search } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CallButton from '@/components/common/CallButton'
import { bookingService } from '@/services/bookingService'
import { isPincodeServed } from '@/utils/helpers'
import { cn } from '@/utils/cn'

/**
 * Pincode service-area checker (architecture doc §10).
 * Tries the backend first; silently falls back to the local pincode list.
 */
export default function ServiceAreaChecker() {
  const [pincode, setPincode] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null) // null | 'served' | 'not_served'

  const check = async (e) => {
    e.preventDefault()
    const value = pincode.trim()
    if (!/^\d{6}$/.test(value)) {
      setError('Enter a valid 6-digit pincode')
      setResult(null)
      return
    }
    setError('')
    setChecking(true)
    let served = isPincodeServed(value)
    try {
      const data = await bookingService.checkServiceArea(value)
      if (typeof data?.served === 'boolean') served = data.served
      else if (typeof data?.is_served === 'boolean') served = data.is_served
    } catch {
      // Backend unavailable — the local list already answered.
    }
    setResult(served ? 'served' : 'not_served')
    setChecking(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-secondary" aria-hidden="true" />
          Check your service area
        </CardTitle>
        <CardDescription>
          Enter your pincode to see if we currently serve your location around Chittoor.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={check} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="area-pincode">Pincode</Label>
            <Input
              id="area-pincode"
              inputMode="numeric"
              maxLength={6}
              placeholder="e.g. 517127"
              value={pincode}
              aria-invalid={error ? 'true' : undefined}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, ''))
                setResult(null)
                setError('')
              }}
            />
            {error && <p className="mt-1 text-xs text-accent">{error}</p>}
          </div>
          <Button type="submit" disabled={checking} className="sm:mb-0">
            {checking ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Search aria-hidden="true" />}
            {checking ? 'Checking…' : 'Check'}
          </Button>
        </form>

        <div aria-live="polite">
          {result === 'served' && (
            <div className="rounded-xl border border-success/30 bg-success-50 p-4">
              <p className="flex items-start gap-2 font-semibold text-success">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                Great news! We serve your area.
              </p>
              <p className="mt-1 text-sm text-ink-light">
                Book a free consultation and we&rsquo;ll visit you for an assessment.
              </p>
              <Link
                to="/book-consultation"
                className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'mt-3')}
              >
                <CalendarCheck aria-hidden="true" /> Book a Consultation
              </Link>
            </div>
          )}
          {result === 'not_served' && (
            <div className="rounded-xl border border-warning/30 bg-warning-50 p-4">
              <p className="flex items-start gap-2 font-semibold text-warning">
                <PhoneCall className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                We don&rsquo;t serve your area yet
              </p>
              <p className="mt-1 text-sm text-ink-light">
                Call us anyway — we may still be able to help, or suggest trusted alternatives near you.
              </p>
              <CallButton className="mt-3" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
