import { Suspense, lazy, ComponentType } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
interface LazyComponentProps<T> { loader: () => Promise<{ default: ComponentType<T> }>; fallback?: React.ReactNode; props?: T; }
export function LazyComponent<T extends object>({ loader, fallback = <LoadingSpinner />, props = {} as T }: LazyComponentProps<T>) {
  const Component = lazy(loader);
  return <Suspense fallback={fallback}><Component {...props} /></Suspense>;
}
