import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Eager-loaded core pages
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Lazy-loaded pages
const ColaboradoresPage = lazy(() => import('@/pages/ColaboradoresPage'));
const ColaboradorFormPage = lazy(() => import('@/pages/ColaboradorFormPage'));
const ColaboradorDetalhesPage = lazy(() => import('@/pages/ColaboradorDetalhesPage'));
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
const PortalPage = lazy(() => import('@/pages/PortalPage'));
const AvaliacaoPage = lazy(() => import('@/pages/AvaliacaoPage'));
const TreinamentosPage = lazy(() => import('@/pages/TreinamentosPage'));
const RecrutamentoPage = lazy(() => import('@/pages/RecrutamentoPage'));
const ContratacaoPage = lazy(() => import('@/pages/ContratacaoPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const AssinaturasPage = lazy(() => import('@/pages/AssinaturasPage'));
const HorasExtrasPage = lazy(() => import('@/pages/HorasExtrasPage'));
const LocaisTrabalhoPage = lazy(() => import('@/pages/LocaisTrabalhoPage'));
const PesquisasClimaPage = lazy(() => import('@/pages/PesquisasClimaPage'));
const WorkflowsPage = lazy(() => import('@/pages/WorkflowsPage'));
const TurnosPage = lazy(() => import('@/pages/TurnosPage'));
const ComunicacaoInternaPage = lazy(() => import('@/pages/ComunicacaoInternaPage'));
const DespesasPage = lazy(() => import('@/pages/DespesasPage'));
const ControleAcessoPage = lazy(() => import('@/pages/ControleAcessoPage'));
const LGPDPage = lazy(() => import('@/pages/LGPDPage'));
const BancoHorasPage = lazy(() => import('@/pages/BancoHorasPage'));
const EPIsPage = lazy(() => import('@/pages/EPIsPage'));
const FaltasPage = lazy(() => import('@/pages/FaltasPage'));
const MedidasDisciplinaresPage = lazy(() => import('@/pages/MedidasDisciplinaresPage'));
const JornadasPage = lazy(() => import('@/pages/JornadasPage'));
const CentrosCustoPage = lazy(() => import('@/pages/CentrosCustoPage'));
const TimesPage = lazy(() => import('@/pages/TimesPage'));
const MovimentacoesPage = lazy(() => import('@/pages/MovimentacoesPage'));
const SindicatosPage = lazy(() => import('@/pages/SindicatosPage'));
const ObrigacoesFiscaisPage = lazy(() => import('@/pages/ObrigacoesFiscaisPage'));
const PlanosSaudePage = lazy(() => import('@/pages/PlanosSaudePage'));
const CanalEticaPage = lazy(() => import('@/pages/CanalEticaPage'));
const ConveniosPage = lazy(() => import('@/pages/ConveniosPage'));
const EscalasPage = lazy(() => import('@/pages/EscalasPage'));
const SegurosVidaPage = lazy(() => import('@/pages/SegurosVidaPage'));
const PensoesPage = lazy(() => import('@/pages/PensoesPage'));
const ValesPage = lazy(() => import('@/pages/ValesPage'));
const ExamesPage = lazy(() => import('@/pages/ExamesPage'));
const HoleritesPage = lazy(() => import('@/pages/HoleritesPage'));
const LotacoesPage = lazy(() => import('@/pages/LotacoesPage'));
const AssistenteIAPage = lazy(() => import('@/pages/AssistenteIAPage'));
const GeradorDocumentosPage = lazy(() => import('@/pages/GeradorDocumentosPage'));
const SSTPage = lazy(() => import('@/pages/SSTPage'));
const CalculadoraRescisaoPage = lazy(() => import('@/pages/CalculadoraRescisaoPage'));
const ImportacaoPage = lazy(() => import('@/pages/ImportacaoPage'));
const DashboardExecutivoPage = lazy(() => import('@/pages/DashboardExecutivoPage'));
const AdminTelemetriaPage = lazy(() => import('@/pages/AdminTelemetriaPage'));
const RubricasPage = lazy(() => import('@/pages/RubricasPage'));
const ProvisoesPage = lazy(() => import('@/pages/ProvisoesPage'));
const FinanceiroBancarioPage = lazy(() => import('@/pages/FinanceiroBancarioPage'));
const ContabilidadePage = lazy(() => import('@/pages/ContabilidadePage'));
const SegurancaPage = lazy(() => import('@/pages/SegurancaPage'));
const PontoKioskPage = lazy(() => import('@/pages/PontoKioskPage'));


function PageLoader() {
  return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;
}

function LazyPage({ Component }: { Component: React.LazyExoticComponent<() => React.ReactElement> }) {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<PageLoader />}><Component /></Suspense>
    </RouteErrorBoundary>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/ponto/kiosk" element={<LazyPage Component={PontoKioskPage} />} />
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
...
      </Route>
      {/* Public route - no auth required */}
      <Route path="/contratacao" element={<Suspense fallback={<PageLoader />}><ContratacaoPage /></Suspense>} />
    </Routes>
  );
}
