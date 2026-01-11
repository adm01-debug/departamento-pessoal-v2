// V15-483
import { Skeleton } from '@/components/ui/skeleton';
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><Skeleton className="h-8 w-48" /><Skeleton className="h-10 w-32" /></div>
      <div className="grid gap-4 md:grid-cols-4">{Array(4).fill(0).map((_, i) => (<Skeleton key={i} className="h-24" />))}</div>
      <Skeleton className="h-64" />
    </div>
  );
}
