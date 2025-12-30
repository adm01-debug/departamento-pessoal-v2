import { lazy, Suspense, ComponentType } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy loaded pages
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyColaboradores = lazy(() => import('@/pages/Colaboradores'));
export const LazyAdmissao = lazy(() => import('@/pages/Admissao'));
export const LazyFolha = lazy(() => import('@/pages/Folha'));
export const LazyFerias = lazy(() => import('@/pages/Ferias'));
export const LazyPonto = lazy(() => import('@/pages/Ponto'));
export const LazyRelatorios = lazy(() => import('@/pages/Relatorios'));
export const LazyConfiguracoes = lazy(() => import('@/pages/Configuracoes'));

export const withSuspense = (Component: ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export default { 
  LazyDashboard, 
  LazyColaboradores, 
  LazyAdmissao, 
  LazyFolha, 
  LazyFerias, 
  LazyPonto, 
  LazyRelatorios, 
  LazyConfiguracoes 
};
