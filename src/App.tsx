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
const FeriadosPage = lazy(() => import('@/pages/FeriadosPage'));
const UsuariosPage = lazy(() => import('@/pages/UsuariosPage'));
const PerfilPage = lazy(() => import('@/pages/PerfilPage'));
const NotificacoesPage = lazy(() => import('@/pages/NotificacoesPage'));
const IntegracoesPage = lazy(() => import('@/pages/IntegracoesPage'));
const BackupPage = lazy(() => import('@/pages/BackupPage'));
const OrganogramaPage = lazy(() => import('@/pages/OrganogramaPage'));

function PageLoader() {
  return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;
}

function LazyPage({ Component }: { Component: React.LazyExoticComponent<() => React.JSX.Element> }) {
  return <Suspense fallback={<PageLoader />}><Component /></Suspense>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="colaboradores" element={<LazyPage Component={ColaboradoresPage} />} />
        <Route path="colaboradores/novo" element={<LazyPage Component={ColaboradorFormPage} />} />
        <Route path="colaboradores/:id/editar" element={<LazyPage Component={ColaboradorFormPage} />} />
        <Route path="empresas" element={<LazyPage Component={EmpresasPage} />} />
        <Route path="empresas/nova" element={<LazyPage Component={EmpresaFormPage} />} />
        <Route path="empresas/:id/editar" element={<LazyPage Component={EmpresaFormPage} />} />
        <Route path="folha" element={<LazyPage Component={FolhaPage} />} />
        <Route path="folha/calcular" element={<LazyPage Component={FolhaPagamentoPage} />} />
        <Route path="ferias" element={<LazyPage Component={FeriasPage} />} />
        <Route path="ponto" element={<LazyPage Component={PontoPage} />} />
        <Route path="beneficios" element={<LazyPage Component={BeneficiosPage} />} />
        <Route path="beneficios/novo" element={<LazyPage Component={BeneficioFormPage} />} />
        <Route path="relatorios" element={<LazyPage Component={RelatoriosPage} />} />
        <Route path="esocial" element={<LazyPage Component={ESocialPage} />} />
        <Route path="configuracoes" element={<LazyPage Component={ConfiguracoesPage} />} />
        <Route path="admissoes" element={<LazyPage Component={AdmissoesPage} />} />
        <Route path="afastamentos" element={<LazyPage Component={AfastamentosPage} />} />
        <Route path="cargos" element={<LazyPage Component={CargosPage} />} />
        <Route path="departamentos" element={<LazyPage Component={DepartamentosPage} />} />
        <Route path="desligamentos" element={<LazyPage Component={DesligamentosPage} />} />
        <Route path="documentos" element={<LazyPage Component={DocumentosPage} />} />
        <Route path="auditoria" element={<LazyPage Component={AuditoriaPage} />} />
        <Route path="feriados" element={<LazyPage Component={FeriadosPage} />} />
        <Route path="usuarios" element={<LazyPage Component={UsuariosPage} />} />
        <Route path="perfil" element={<LazyPage Component={PerfilPage} />} />
        <Route path="notificacoes" element={<LazyPage Component={NotificacoesPage} />} />
        <Route path="integracoes" element={<LazyPage Component={IntegracoesPage} />} />
        <Route path="backup" element={<LazyPage Component={BackupPage} />} />
        <Route path="organograma" element={<LazyPage Component={OrganogramaPage} />} />
        <Route path="design-system" element={<LazyPage Component={DesignSystemPage} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
