// @ts-nocheck
/**
 * @fileoverview Hook para lazy loading de componentes
 * @module hooks/useLazyComponent
 */
import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/** Opções do lazy component */
interface LazyComponentOptions {
  /** Fallback durante carregamento */
  fallback?: ReactNode;
  /** Delay mínimo para exibir loading */
  minDelay?: number;
}

/**
 * Cria componente lazy com loading state
 * @param importFn - Função de import dinâmico
 * @param options - Opções de configuração
 * @returns Componente lazy wrapped
 */
export function createLazyComponent<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): { Component: T; Wrapper: ComponentType } {
  const { fallback, minDelay = 0 } = options;

  const LazyComponent = lazy(async () => {
    const [module] = await Promise.all([
      importFn(),
      minDelay > 0 ? new Promise(resolve => setTimeout(resolve, minDelay)) : Promise.resolve(),
    ]);
    return module;
  });

  const defaultFallback = (
    <div className="w-full space-y-4 p-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-8 w-2/3" />
    </div>
  );

  const Wrapper: ComponentType = (props) => (
    <Suspense fallback={fallback ?? defaultFallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  return { Component: LazyComponent as T, Wrapper };
}

/**
 * Preload de componente lazy
 * @param importFn - Função de import
 */
export function preloadComponent(importFn: () => Promise<unknown>): void {
  importFn();
}
