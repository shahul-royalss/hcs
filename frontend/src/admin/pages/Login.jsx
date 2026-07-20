import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { LogIn, ShieldCheck } from 'lucide-react'
import Logo from '@/components/common/Logo'
import Seo from '@/components/common/Seo'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { apiErrorMessage } from '@/services/api'
import { rules } from '@/utils/validation'

/** Admin sign-in page (public route). */
export default function Login() {
  const { isAuthenticated, loading, login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [formError, setFormError] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  if (loading) return <LoadingSpinner fullPage />
  if (isAuthenticated) return <Navigate to="/admin" replace />

  const onSubmit = async ({ email, password }) => {
    setFormError(null)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (error) {
      const message = apiErrorMessage(error, 'Login failed. Please check your credentials.')
      setFormError(message)
      toast.error(message)
    }
  }

  return (
    <>
      <Seo title="Admin — Login" description="Dhrishta Health Care Services admin portal sign-in." />
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary-900 p-4">
        {/* Night exposure: navy field, one shaft of gold light */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(90% 70% at 25% 0%, rgba(194,154,85,0.16), transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="light-shaft absolute -top-40 left-[18%] h-[120%] w-80" aria-hidden="true" />
        <Card className="relative w-full max-w-md p-8 shadow-card-hover ring-1 ring-white/20">
          <div className="mb-6 text-center">
            <Logo className="mx-auto h-12 w-auto" />
            <h1 className="mt-4 font-heading text-2xl font-bold text-primary">Admin Portal</h1>
            <p className="mt-1 text-sm text-ink-light">Sign in to manage bookings, staff and patients</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-4">
              <div>
                <Label htmlFor="admin-email" required>
                  Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@dhrishta.com"
                  {...register('email', rules.email)}
                />
                {errors.email && <p className="mt-1 text-xs text-accent">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="admin-password" required>
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Your password"
                  {...register('password', rules.required('Password'))}
                />
                {errors.password && <p className="mt-1 text-xs text-accent">{errors.password.message}</p>}
              </div>

              {formError && (
                <p role="alert" className="rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent">
                  {formError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <LogIn className="h-4 w-4" />
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </div>
          </form>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-ink-light">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Authorized personnel only
          </p>
        </Card>
      </div>
    </>
  )
}
