import { Suspense, ComponentType, ReactNode, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LazyComponentProps<T extends Record<string, unknown>> {
  loader: () => Promise<{ default: ComponentType<T> }>;
  fallback?: ReactNode;
  componentProps?: T;
}

export function LazyComponent<T extends Record<string, unknown>>({
  loader,
  fallback = <LoadingSpinner />,
  componentProps,
}: LazyComponentProps<T>) {
  const Component = lazy(loader) as ComponentType<T>;
  return (
    <Suspense fallback={fallback}>
      {componentProps ? <Component {...componentProps} /> : <Component {...({} as T)} />}
    </Suspense>
  );
}
