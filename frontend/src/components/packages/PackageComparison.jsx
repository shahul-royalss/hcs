import { Check, Minus } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { packages } from '@/data/packages'
import { formatINR } from '@/utils/formatters'
import { cn } from '@/utils/cn'

/** Union of every "what's included" item across all packages (order preserved). */
const INCLUDED_ITEMS = [...new Set(packages.flatMap((pkg) => pkg.included))]

/**
 * Side-by-side comparison of all five packages.
 * Horizontally scrollable on small screens (handled by the ui/table wrapper).
 */
export default function PackageComparison() {
  return (
    <Table className="min-w-[880px] bg-white">
      <caption className="sr-only">Comparison of Dhrishta care packages</caption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col" className="w-64">
            What&rsquo;s included
          </TableHead>
          {packages.map((pkg) => (
            <TableHead
              key={pkg.id}
              scope="col"
              className={cn('text-center', pkg.popular && 'text-secondary-700')}
            >
              {pkg.name}
              {pkg.popular && (
                <span className="block text-[10px] font-bold normal-case tracking-normal text-secondary">
                  Most Popular
                </span>
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {INCLUDED_ITEMS.map((item) => (
          <TableRow key={item}>
            <TableHead scope="row" className="font-medium text-ink">
              {item}
            </TableHead>
            {packages.map((pkg) => (
              <TableCell key={pkg.id} className="text-center">
                {pkg.included.includes(item) ? (
                  <>
                    <Check className="mx-auto h-4 w-4 text-success" aria-hidden="true" />
                    <span className="sr-only">Included</span>
                  </>
                ) : (
                  <>
                    <Minus className="mx-auto h-4 w-4 text-slate-300" aria-hidden="true" />
                    <span className="sr-only">Not included</span>
                  </>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}

        <TableRow>
          <TableHead scope="row" className="font-medium text-ink">
            Staff assignment
          </TableHead>
          {packages.map((pkg) => (
            <TableCell key={pkg.id} className="text-center text-xs text-ink-light">
              {pkg.staffAssignment}
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableHead scope="row" className="font-medium text-ink">
            Support hours
          </TableHead>
          {packages.map((pkg) => (
            <TableCell key={pkg.id} className="text-center text-xs text-ink-light">
              {pkg.supportHours}
            </TableCell>
          ))}
        </TableRow>

        <TableRow className="bg-primary-50/40">
          <TableHead scope="row" className="font-semibold text-primary">
            Price
          </TableHead>
          {packages.map((pkg) => (
            <TableCell key={pkg.id} className="text-center">
              <span className="font-heading font-bold text-primary">
                {pkg.price != null ? formatINR(pkg.price) : 'Custom quote'}
              </span>
              {pkg.price != null && (
                <span className="block text-xs text-ink-light">{pkg.priceUnit}</span>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  )
}
