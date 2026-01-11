// V15-119: src/performance/LazyComponents.tsx
import React, { lazy, Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoaderProps {
  fallback?: React.ReactNode;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export function withLazy<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Pre-configured lazy components
export const LazyDashboard = withLazy(() => import('@/pages/Dashboard'));
export const LazyColaboradores = withLazy(() => import('@/pages/Colaboradores'));
export const LazyFolha = withLazy(() => import('@/pages/FolhaPage'));
export const LazyFerias = withLazy(() => import('@/pages/FeriasPage'));
export const LazyPonto = withLazy(() => import('@/pages/PontoPage'));
export const LazyRelatorios = withLazy(() => import('@/pages/RelatoriosPage'));
export const LazyConfiguracoes = withLazy(() => import('@/pages/ConfiguracoesPage'));
export const LazyESocial = withLazy(() => import('@/pages/ESocialPage'));

// Utility for route-based lazy loading
export function createLazyRoute(importFn: () => Promise<{ default: ComponentType<any> }>) {
  return {
    lazy: async () => {
      const module = await importFn();
      return { Component: module.default };
    },
  };
}

// Preload function for critical routes
export function preloadComponent(importFn: () => Promise<any>): void {
  importFn();
}

// Intersection Observer based lazy loading
export function useLazyLoad(ref: React.RefObject<HTMLElement>, callback: () => void) {
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { callback(); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, callback]);
}
