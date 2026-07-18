import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { LogIn, ShieldCheck } from 'lucide-react'
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
      <Seo title="Admin — Login" description="Dhrishta Healthcare Services admin portal sign-in." />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-secondary-700 p-4">
        <Card className="w-full max-w-md p-8">
          <div className="mb-6 text-center">
            <img src="/images/logo.svg" alt="Dhrishta Healthcare Services" className="mx-auto h-12 w-auto" />
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
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-accent">
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
