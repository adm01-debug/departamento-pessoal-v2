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

function PageLoader() {
  return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;
}

function LazyPage({ Component }: { Component: React.LazyExoticComponent<() => React.ReactElement> }) {
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
        <Route path="colaboradores/:id/detalhes" element={<LazyPage Component={ColaboradorDetalhesPage} />} />
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
        <Route path="portal" element={<LazyPage Component={PortalPage} />} />
        <Route path="avaliacao" element={<LazyPage Component={AvaliacaoPage} />} />
        <Route path="treinamentos" element={<LazyPage Component={TreinamentosPage} />} />
        <Route path="recrutamento" element={<LazyPage Component={RecrutamentoPage} />} />
        <Route path="onboarding" element={<LazyPage Component={OnboardingPage} />} />
        <Route path="assinaturas" element={<LazyPage Component={AssinaturasPage} />} />
        <Route path="design-system" element={<LazyPage Component={DesignSystemPage} />} />
        <Route path="horas-extras" element={<LazyPage Component={HorasExtrasPage} />} />
        <Route path="locais-trabalho" element={<LazyPage Component={LocaisTrabalhoPage} />} />
        <Route path="pesquisas-clima" element={<LazyPage Component={PesquisasClimaPage} />} />
        <Route path="workflows" element={<LazyPage Component={WorkflowsPage} />} />
        <Route path="turnos" element={<LazyPage Component={TurnosPage} />} />
        <Route path="comunicacao" element={<LazyPage Component={ComunicacaoInternaPage} />} />
        <Route path="despesas" element={<LazyPage Component={DespesasPage} />} />
        <Route path="controle-acesso" element={<LazyPage Component={ControleAcessoPage} />} />
        <Route path="lgpd" element={<LazyPage Component={LGPDPage} />} />
        <Route path="banco-horas" element={<LazyPage Component={BancoHorasPage} />} />
        <Route path="epis" element={<LazyPage Component={EPIsPage} />} />
        <Route path="faltas" element={<LazyPage Component={FaltasPage} />} />
        <Route path="medidas-disciplinares" element={<LazyPage Component={MedidasDisciplinaresPage} />} />
        <Route path="jornadas" element={<LazyPage Component={JornadasPage} />} />
        <Route path="centros-custo" element={<LazyPage Component={CentrosCustoPage} />} />
        <Route path="times" element={<LazyPage Component={TimesPage} />} />
        <Route path="movimentacoes" element={<LazyPage Component={MovimentacoesPage} />} />
        <Route path="sindicatos" element={<LazyPage Component={SindicatosPage} />} />
        <Route path="obrigacoes-fiscais" element={<LazyPage Component={ObrigacoesFiscaisPage} />} />
        <Route path="planos-saude" element={<LazyPage Component={PlanosSaudePage} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      {/* Public route - no auth required */}
      <Route path="/contratacao" element={<Suspense fallback={<PageLoader />}><ContratacaoPage /></Suspense>} />
    </Routes>
  );
}
