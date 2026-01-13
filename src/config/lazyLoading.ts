// V20-PERF001: Configuração de Lazy Loading
import { lazy, Suspense } from "react";

// Lazy loaded pages
export const LazyDashboard = lazy(() => import("@/pages/Dashboard"));
export const LazyColaboradores = lazy(() => import("@/pages/Colaboradores"));
export const LazyFolhaPagamento = lazy(() => import("@/pages/FolhaPagamento"));
export const LazyFerias = lazy(() => import("@/pages/Ferias"));
export const LazyPonto = lazy(() => import("@/pages/Ponto"));
export const LazyBeneficios = lazy(() => import("@/pages/Beneficios"));
export const LazyESocial = lazy(() => import("@/pages/ESocial"));
export const LazyRelatorios = lazy(() => import("@/pages/Relatorios"));
export const LazyConfiguracoes = lazy(() => import("@/pages/Configuracoes"));
export const LazyAdmissao = lazy(() => import("@/pages/Admissao"));
export const LazyDemissao = lazy(() => import("@/pages/Demissao"));
export const LazyRescisao = lazy(() => import("@/pages/Rescisao"));

// Loading component
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Wrapper component
export const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export default { LazyDashboard, LazyColaboradores, PageLoader, LazyPage };
