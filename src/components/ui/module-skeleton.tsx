import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/* ─── Shimmer Skeleton ─── */
function ShimmerBar({ className }: { className?: string }) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl bg-muted/60',
      className
    )}>
      <motion.div
        animate={{ 
          x: ['-100%', '100%'],
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
      />
    </div>
  );
}

/* ─── KPI Card Skeleton ─── */
export function KPICardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden border border-border/30 rounded-2xl p-card-space"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]">
        <ShimmerBar className="h-full rounded-none" />
      </div>
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <ShimmerBar className="h-3 w-20" />
          <ShimmerBar className="h-8 w-28" />
          <div className="flex items-center gap-2">
            <ShimmerBar className="h-5 w-14 rounded-full" />
            <ShimmerBar className="h-3 w-24" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <ShimmerBar className="h-12 w-12 rounded-2xl" />
          <ShimmerBar className="h-6 w-16" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Table Row Skeleton ─── */
export function TableRowSkeleton({ columns = 5, index = 0 }: { columns?: number; index?: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-border/20"
    >
      {Array(columns).fill(0).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <ShimmerBar className={cn('h-4', i === 0 ? 'w-32' : i === columns - 1 ? 'w-16' : 'w-24')} />
        </td>
      ))}
    </motion.tr>
  );
}

/* ─── Table Skeleton ─── */
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-2xl border border-border/30 overflow-hidden">
      <div className="bg-muted/30 px-4 py-3 flex gap-6">
        {Array(columns).fill(0).map((_, i) => (
          <ShimmerBar key={i} className={cn('h-3', i === 0 ? 'w-20' : 'w-16')} />
        ))}
      </div>
      <table className="w-full">
        <tbody>
          {Array(rows).fill(0).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} index={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Card Skeleton ─── */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('border border-border/30 rounded-2xl p-card-space space-y-4', className)}>
      <div className="flex items-center gap-3">
        <ShimmerBar className="h-10 w-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <ShimmerBar className="h-4 w-32" />
          <ShimmerBar className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-3">
        <ShimmerBar className="h-3 w-full" />
        <ShimmerBar className="h-3 w-3/4" />
        <ShimmerBar className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/* ─── Dashboard Full Skeleton ─── */
export function DashboardSkeleton() {
  return (
    <div className="space-y-section max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <ShimmerBar className="h-9 w-48" />
          <ShimmerBar className="h-4 w-72" />
        </div>
        <ShimmerBar className="h-9 w-32 rounded-xl" />
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <KPICardSkeleton key={i} index={i} />
        ))}
      </div>

      {/* Second row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* ─── List Page Skeleton ─── */
export function ListPageSkeleton() {
  return (
    <div className="space-y-section">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <ShimmerBar className="h-10 flex-1 max-w-sm" />
        <ShimmerBar className="h-10 w-28" />
        <ShimmerBar className="h-10 w-28" />
      </div>
      <TableSkeleton />
    </div>
  );
}

/* ─── Stat Card Skeleton ─── */
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/30 p-4 text-center space-y-2">
      <ShimmerBar className="h-7 w-12 mx-auto" />
      <ShimmerBar className="h-3 w-16 mx-auto" />
    </div>
  );
}

/* ─── Grid Card Skeleton (Empresas) ─── */
export function GridCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/30 p-5 space-y-4">
      <div className="flex items-center gap-4">
        <ShimmerBar className="h-10 w-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <ShimmerBar className="h-4 w-3/4" />
          <ShimmerBar className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <ShimmerBar className="h-3 w-24" />
        <ShimmerBar className="h-8 w-16 rounded-xl" />
      </div>
    </div>
  );
}
