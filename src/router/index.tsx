// V15-231: src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { LoginPage, DashboardPage, ColaboradoresPage, ColaboradorFormPage, EmpresasPage, FolhaPage, FeriasPage, PontoPage, BeneficiosPage, RelatoriosPage } from '@/pages';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'colaboradores', element: <ColaboradoresPage /> },
      { path: 'colaboradores/novo', element: <ColaboradorFormPage /> },
      { path: 'colaboradores/:id', element: <ColaboradorFormPage /> },
      { path: 'colaboradores/:id/editar', element: <ColaboradorFormPage /> },
      { path: 'empresas', element: <EmpresasPage /> },
      { path: 'empresas/nova', element: <EmpresasPage /> },
      { path: 'empresas/:id', element: <EmpresasPage /> },
      { path: 'folha', element: <FolhaPage /> },
      { path: 'folha/:id', element: <FolhaPage /> },
      { path: 'ferias', element: <FeriasPage /> },
      { path: 'ponto', element: <PontoPage /> },
      { path: 'beneficios', element: <BeneficiosPage /> },
      { path: 'relatorios', element: <RelatoriosPage /> },
      { path: 'relatorios/:tipo', element: <RelatoriosPage /> },
    ],
  },
]);
