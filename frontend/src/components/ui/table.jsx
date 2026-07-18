import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto rounded-xl border border-slate-100">
    <table ref={ref} className={cn('w-full text-left text-sm', className)} {...props} />
  </div>
))
Table.displayName = 'Table'

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-surface text-xs uppercase tracking-wide text-ink-light', className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('divide-y divide-slate-100', className)} {...props} />
))
TableBody.displayName = 'TableBody'

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('transition-colors hover:bg-primary-50/40', className)} {...props} />
))
TableRow.displayName = 'TableRow'

const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th ref={ref} className={cn('px-4 py-3 font-semibold', className)} {...props} />
))
TableHead.displayName = 'TableHead'

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-4 py-3 align-middle', className)} {...props} />
))
TableCell.displayName = 'TableCell'

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
