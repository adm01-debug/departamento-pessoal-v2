import { Suspense, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
interface SuspenseWrapperProps { children: ReactNode; fallback?: ReactNode; }
export function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps) {
  return (<Suspense fallback={fallback || <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-3/4" /></div>}>{children}</Suspense>);
}
