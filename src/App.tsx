import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Eager-loaded core pages
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Lazy-loaded pages
const ColaboradoresPage = lazy(() => import('@/pages/ColaboradoresPage'));
const ColaboradorFormPage = lazy(() => import('@/pages/ColaboradorFormPage'));
const EmpresasPage = lazy(() => import('@/pages/EmpresasPage'));
const EmpresaFormPage = lazy(() => import('@/pages/EmpresaFormPage'));
const FolhaPage = lazy(() => import('@/pages/FolhaPage'));
const FolhaPagamentoPage = lazy(() => import('@/pages/FolhaPagamentoPage'));
const FeriasPage = lazy(() => import('@/pages/FeriasPage'));
const PontoPage = lazy(() => import('@/pages/PontoPage'));
const BeneficiosPage = lazy(() => import('@/pages/BeneficiosPage'));
const BeneficioFormPage = lazy(() => import('@/pages/BeneficioFormPage'));
const RelatoriosPage = lazy(() => import('@/pages/RelatoriosPage'));
const ESocialPage = lazy(() => import('@/pages/ESocialPage'));
const ConfiguracoesPage = lazy(() => import('@/pages/ConfiguracoesPage'));
const DesignSystemPage = lazy(() => import('@/pages/DesignSystemPage'));
const AdmissoesPage = lazy(() => import('@/pages/AdmissoesPage'));
const AfastamentosPage = lazy(() => import('@/pages/AfastamentosPage'));
const CargosPage = lazy(() => import('@/pages/CargosPage'));
const DepartamentosPage = lazy(() => import('@/pages/DepartamentosPage'));
const DesligamentosPage = lazy(() => import('@/pages/DesligamentosPage'));
const DocumentosPage = lazy(() => import('@/pages/DocumentosPage'));
const AuditoriaPage = lazy(() => import('@/pages/AuditoriaPage'));

function PageLoader() {
  return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="colaboradores" element={<Suspense fallback={<PageLoader />}><ColaboradoresPage /></Suspense>} />
        <Route path="colaboradores/novo" element={<Suspense fallback={<PageLoader />}><ColaboradorFormPage /></Suspense>} />
        <Route path="colaboradores/:id/editar" element={<Suspense fallback={<PageLoader />}><ColaboradorFormPage /></Suspense>} />
        <Route path="empresas" element={<Suspense fallback={<PageLoader />}><EmpresasPage /></Suspense>} />
        <Route path="empresas/nova" element={<Suspense fallback={<PageLoader />}><EmpresaFormPage /></Suspense>} />
        <Route path="empresas/:id/editar" element={<Suspense fallback={<PageLoader />}><EmpresaFormPage /></Suspense>} />
        <Route path="folha" element={<Suspense fallback={<PageLoader />}><FolhaPage /></Suspense>} />
        <Route path="folha/calcular" element={<Suspense fallback={<PageLoader />}><FolhaPagamentoPage /></Suspense>} />
        <Route path="ferias" element={<Suspense fallback={<PageLoader />}><FeriasPage /></Suspense>} />
        <Route path="ponto" element={<Suspense fallback={<PageLoader />}><PontoPage /></Suspense>} />
        <Route path="beneficios" element={<Suspense fallback={<PageLoader />}><BeneficiosPage /></Suspense>} />
        <Route path="beneficios/novo" element={<Suspense fallback={<PageLoader />}><BeneficioFormPage /></Suspense>} />
        <Route path="relatorios" element={<Suspense fallback={<PageLoader />}><RelatoriosPage /></Suspense>} />
        <Route path="esocial" element={<Suspense fallback={<PageLoader />}><ESocialPage /></Suspense>} />
        <Route path="configuracoes" element={<Suspense fallback={<PageLoader />}><ConfiguracoesPage /></Suspense>} />
        <Route path="admissoes" element={<Suspense fallback={<PageLoader />}><AdmissoesPage /></Suspense>} />
        <Route path="afastamentos" element={<Suspense fallback={<PageLoader />}><AfastamentosPage /></Suspense>} />
        <Route path="cargos" element={<Suspense fallback={<PageLoader />}><CargosPage /></Suspense>} />
        <Route path="departamentos" element={<Suspense fallback={<PageLoader />}><DepartamentosPage /></Suspense>} />
        <Route path="desligamentos" element={<Suspense fallback={<PageLoader />}><DesligamentosPage /></Suspense>} />
        <Route path="documentos" element={<Suspense fallback={<PageLoader />}><DocumentosPage /></Suspense>} />
        <Route path="auditoria" element={<Suspense fallback={<PageLoader />}><AuditoriaPage /></Suspense>} />
        <Route path="design-system" element={<Suspense fallback={<PageLoader />}><DesignSystemPage /></Suspense>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
