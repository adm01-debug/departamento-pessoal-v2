// V18-PERF-001: Configuracao Lazy Loading para Pages
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load wrapper
export function lazyLoad<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFn);
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Pre-configured lazy pages
export const LazyDashboard = lazyLoad(() => import('@/pages/Dashboard'));
export const LazyColaboradores = lazyLoad(() => import('@/pages/colaboradores/ColaboradoresPage'));
export const LazyFolha = lazyLoad(() => import('@/pages/folha/FolhaPage'));
export const LazyFerias = lazyLoad(() => import('@/pages/ferias/FeriasPage'));
export const LazyPonto = lazyLoad(() => import('@/pages/ponto/PontoPage'));
export const LazyESocial = lazyLoad(() => import('@/pages/esocial/ESocialPage'));
export const LazyRelatorios = lazyLoad(() => import('@/pages/relatorios/RelatoriosPage'));
export const LazyConfiguracoes = lazyLoad(() => import('@/pages/configuracoes/ConfiguracoesPage'));
