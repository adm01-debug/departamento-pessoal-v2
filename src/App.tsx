// V15-442
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from '@/guards';
import { MainLayout } from '@/components/layout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ColaboradoresPage from '@/pages/ColaboradoresPage';
import ColaboradorFormPage from '@/pages/ColaboradorFormPage';
import EmpresasPage from '@/pages/EmpresasPage';
import FolhaPage from '@/pages/FolhaPage';
import FeriasPage from '@/pages/FeriasPage';
import PontoPage from '@/pages/PontoPage';
import BeneficiosPage from '@/pages/BeneficiosPage';
import RelatoriosPage from '@/pages/RelatoriosPage';
import ESocialPage from '@/pages/ESocialPage';
import ConfiguracoesPage from '@/pages/ConfiguracoesPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AuthGuard><MainLayout /></AuthGuard>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="colaboradores" element={<ColaboradoresPage />} />
        <Route path="colaboradores/novo" element={<ColaboradorFormPage />} />
        <Route path="colaboradores/:id/editar" element={<ColaboradorFormPage />} />
        <Route path="empresas" element={<EmpresasPage />} />
        <Route path="folha" element={<FolhaPage />} />
        <Route path="ferias" element={<FeriasPage />} />
        <Route path="ponto" element={<PontoPage />} />
        <Route path="beneficios" element={<BeneficiosPage />} />
        <Route path="relatorios" element={<RelatoriosPage />} />
        <Route path="esocial" element={<ESocialPage />} />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
