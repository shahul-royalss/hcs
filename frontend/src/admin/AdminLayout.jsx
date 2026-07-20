import { useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ThemeToggle from '@/components/common/ThemeToggle'
import AdminSidebar from '@/admin/components/AdminSidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { titleCase } from '@/utils/formatters'

/** Authenticated shell for the admin portal (sidebar + content outlet). */
export default function AdminLayout() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  if (loading) return <LoadingSpinner fullPage />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login')
    } catch {
      // The token is cleared even if the API call failed — hard-navigate to reset state.
      window.location.assign('/admin/login')
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ivory-300 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="rounded-xl p-2 text-ink transition-colors hover:bg-surface"
        >
          <Menu className="h-5 w-5" />
        </button>
        <img src="/images/logo.svg" alt="" className="h-8 w-auto" />
        <span className="font-heading text-sm font-bold text-primary">Admin Portal</span>
      </header>

      <main className="relative min-h-screen bg-surface p-6 lg:pl-72">
        {/* Morning warmth over the working canvas */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72"
          style={{ background: 'radial-gradient(80% 100% at 30% 0%, rgba(234,217,176,0.28), transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative mb-6 flex flex-wrap items-center justify-end gap-3">
          <ThemeToggle compact />
          <span className="text-sm font-medium text-ink">{user?.name || user?.email || 'Admin'}</span>
          <Badge variant="secondary">{titleCase(user?.role || 'admin')}</Badge>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="relative">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
