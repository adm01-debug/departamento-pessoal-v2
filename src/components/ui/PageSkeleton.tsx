import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface PageSkeletonProps {
  type?: 'table' | 'form' | 'cards' | 'dashboard';
}

export const PageSkeleton = memo(function PageSkeleton({ type = 'table' }: PageSkeletonProps) {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-32 mt-4" />
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-12 w-full" />
      {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
    </div>
  );
});

export default PageSkeleton;

PageSkeleton.displayName = 'PageSkeleton';
