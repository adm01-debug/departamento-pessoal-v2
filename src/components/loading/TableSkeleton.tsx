// V15-484
import { Skeleton } from '@/components/ui/skeleton';
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between"><Skeleton className="h-10 w-64" /><Skeleton className="h-10 w-32" /></div>
      <div className="border rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-4 border-b bg-muted/50">{Array(5).fill(0).map((_, i) => (<Skeleton key={i} className="h-4" />))}</div>
        {Array(rows).fill(0).map((_, i) => (<div key={i} className="grid grid-cols-5 gap-4 p-4 border-b">{Array(5).fill(0).map((_, j) => (<Skeleton key={j} className="h-4" />))}</div>))}
      </div>
    </div>
  );
}
