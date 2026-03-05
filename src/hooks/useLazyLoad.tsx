// @ts-nocheck
import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyLoadOptions {
  fallback?: ReactNode;
  delay?: number;
}

/**
 * Cria um componente lazy-loaded com fallback
 */
export function lazyLoad<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): T {
  const { fallback = <DefaultFallback />, delay = 0 } = options;

  const LazyComponent = lazy(async () => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return importFn();
  });

  const WrappedComponent = (props: unknown) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...(props as object)} />
    </Suspense>
  );

  return WrappedComponent as T;
}

function DefaultFallback(): ReactNode {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

// Páginas lazy-loaded
export const LazyDashboard = lazyLoad(() => import('@/pages/Dashboard'));
export const LazyColaboradores = lazyLoad(() => import('@/pages/Colaboradores'));
export const LazyFerias = lazyLoad(() => import('@/pages/Ferias'));
export const LazyFolha = lazyLoad(() => import('@/pages/Folha'));
export const LazyPonto = lazyLoad(() => import('@/pages/Ponto'));
export const LazyRelatorios = lazyLoad(() => import('@/pages/Relatorios'));
export const LazyESocial = lazyLoad(() => import('@/pages/ESocial'));
export const LazyBeneficios = lazyLoad(() => import('@/pages/Beneficios'));
export const LazyAfastamentos = lazyLoad(() => import('@/pages/Afastamentos'));
export const LazyAdmissao = lazyLoad(() => import('@/pages/Admissao'));
export const LazyDesligamento = lazyLoad(() => import('@/pages/Desligamento'));
export const LazyAuditoria = lazyLoad(() => import('@/pages/Auditoria'));

export default lazyLoad;
