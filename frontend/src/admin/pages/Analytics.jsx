import { useCallback, useEffect, useState } from 'react'
import { IndianRupee, RefreshCw, TrendingUp, Wallet } from 'lucide-react'
import Seo from '@/components/common/Seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import StatCards from '@/admin/components/StatCards'
import { adminService } from '@/services/adminService'
import { apiErrorMessage } from '@/services/api'
import { formatINR, titleCase } from '@/utils/formatters'

const pick = (...values) => values.find((value) => value !== undefined && value !== null)

const normalizeTrends = (data) => {
  const list = [data?.trends, data?.bookings, data?.data, Array.isArray(data) ? data : null].find(Array.isArray) || []
  return list.map((item) => ({
    label: String(pick(item?.month, item?.label, item?.date, item?._id, '—')),
    value: Number(pick(item?.count, item?.bookings, item?.total, item?.value, 0)) || 0,
  }))
}

const normalizeServices = (data) => {
  const list =
    [data?.services, data?.popular_services, data?.data, Array.isArray(data) ? data : null].find(Array.isArray) || []
  return list.map((item) => ({
    label: titleCase(pick(item?.service, item?.service_type, item?.name, item?._id, '—')),
    value: Number(pick(item?.count, item?.bookings, item?.total, item?.value, 0)) || 0,
  }))
}

function PanelError({ detail, onRetry }) {
  return (
    <div className="py-6 text-center">
      <p className="text-sm font-medium text-ink">Could not reach the server — is the backend running?</p>
      {detail && <p className="mt-1 text-xs text-ink-light">{detail}</p>}
      <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  )
}

/** Analytics: booking trends, revenue summary and popular services (no chart library). */
export default function Analytics() {
  const [trends, setTrends] = useState({ loading: true, error: null, data: null })
  const [revenue, setRevenue] = useState({ loading: true, error: null, data: null })
  const [services, setServices] = useState({ loading: true, error: null, data: null })

  const runPanel = useCallback(async (fetcher, setState) => {
    setState({ loading: true, error: null, data: null })
    try {
      const data = await fetcher()
      setState({ loading: false, error: null, data })
    } catch (err) {
      setState({ loading: false, error: apiErrorMessage(err), data: null })
    }
  }, [])

  const loadAll = useCallback(
    () =>
      Promise.allSettled([
        runPanel(adminService.bookingTrends, setTrends),
        runPanel(adminService.revenue, setRevenue),
        runPanel(adminService.popularServices, setServices),
      ]),
    [runPanel]
  )

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const trendPoints = normalizeTrends(trends.data)
  const trendMax = Math.max(...trendPoints.map((point) => point.value), 1)

  const servicePoints = normalizeServices(services.data)
  const serviceMax = Math.max(...servicePoints.map((point) => point.value), 1)

  const revenueData = revenue.data
  const revenueStats = [
    {
      label: 'Total revenue',
      value: formatINR(pick(revenueData?.total_revenue, revenueData?.total)),
      icon: IndianRupee,
      color: 'primary',
    },
    {
      label: 'This month',
      value: formatINR(
        pick(revenueData?.this_month, revenueData?.month_revenue, revenueData?.monthly, revenueData?.revenue_this_month)
      ),
      icon: TrendingUp,
      color: 'success',
    },
    {
      label: 'Avg booking value',
      value: formatINR(
        pick(revenueData?.average_booking_value, revenueData?.avg_booking_value, revenueData?.average)
      ),
      icon: Wallet,
      color: 'secondary',
    },
  ]

  return (
    <>
      <Seo title="Admin — Analytics" />
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Analytics</h1>
        <p className="text-sm text-ink-light">Booking trends, revenue and service popularity</p>
      </div>

      <div className="space-y-6">
        {/* Revenue summary */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue summary</CardTitle>
          </CardHeader>
          <CardContent>
            {revenue.loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : revenue.error ? (
              <PanelError detail={revenue.error} onRetry={() => runPanel(adminService.revenue, setRevenue)} />
            ) : (
              <StatCards stats={revenueStats} />
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          {/* Booking trends */}
          <Card>
            <CardHeader>
              <CardTitle>Booking trends</CardTitle>
            </CardHeader>
            <CardContent>
              {trends.loading ? (
                <Skeleton className="h-48" />
              ) : trends.error ? (
                <PanelError detail={trends.error} onRetry={() => runPanel(adminService.bookingTrends, setTrends)} />
              ) : trendPoints.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-light">No records yet</p>
              ) : (
                <div className="flex items-end gap-2 overflow-x-auto pb-1">
                  {trendPoints.map((point, index) => (
                    <div key={`${point.label}-${index}`} className="flex min-w-[40px] flex-1 flex-col items-center">
                      <span className="mb-1 text-xs font-medium text-ink">{point.value}</span>
                      <div className="flex h-36 w-full items-end">
                        <div
                          className="w-full rounded-t-md bg-secondary transition-all"
                          style={{ height: `${Math.max((point.value / trendMax) * 100, 3)}%` }}
                          title={`${point.label}: ${point.value}`}
                        />
                      </div>
                      <span className="mt-1 w-full truncate text-center text-[10px] text-ink-light">
                        {point.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular services */}
          <Card>
            <CardHeader>
              <CardTitle>Popular services</CardTitle>
            </CardHeader>
            <CardContent>
              {services.loading ? (
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-9" />
                  ))}
                </div>
              ) : services.error ? (
                <PanelError
                  detail={services.error}
                  onRetry={() => runPanel(adminService.popularServices, setServices)}
                />
              ) : servicePoints.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-light">No records yet</p>
              ) : (
                <div className="space-y-4">
                  {servicePoints.map((point, index) => (
                    <div key={`${point.label}-${index}`}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-medium text-ink">{point.label}</span>
                        <span className="shrink-0 text-ink-light">{point.value}</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(point.value / serviceMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
