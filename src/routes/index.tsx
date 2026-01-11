// V15-523
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from '@/guards';
import { AppLayout } from '@/layouts';
import * as Pages from '@/pages';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Pages.LoginPage />} />
      <Route path="/" element={<AuthGuard><AppLayout /></AuthGuard>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Pages.DashboardPage />} />
        <Route path="colaboradores" element={<Pages.ColaboradoresPage />} />
        <Route path="colaboradores/novo" element={<Pages.ColaboradorFormPage />} />
        <Route path="colaboradores/:id/editar" element={<Pages.ColaboradorFormPage />} />
        <Route path="empresas" element={<Pages.EmpresasPage />} />
        <Route path="folha" element={<Pages.FolhaPage />} />
        <Route path="ferias" element={<Pages.FeriasPage />} />
        <Route path="ponto" element={<Pages.PontoPage />} />
        <Route path="beneficios" element={<Pages.BeneficiosPage />} />
        <Route path="relatorios" element={<Pages.RelatoriosPage />} />
        <Route path="esocial" element={<Pages.ESocialPage />} />
        <Route path="configuracoes" element={<Pages.ConfiguracoesPage />} />
        <Route path="*" element={<Pages.NotFoundPage />} />
      </Route>
    </Routes>
  );
}
