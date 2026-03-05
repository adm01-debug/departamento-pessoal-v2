// @ts-nocheck
// V18-PERF-001: Configuracao Lazy Loading para Pages
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export function lazyLoad(importFn: () => Promise<any>) {
  const LazyComponent = lazy(importFn);
  return (props: any) => (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
