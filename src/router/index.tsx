import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { ColaboradoresPage } from "@/pages/ColaboradoresPage";
import { FolhaPagamentoPage } from "@/pages/FolhaPagamentoPage";
import { FeriasPage } from "@/pages/FeriasPage";
import { PontoPage } from "@/pages/PontoPage";
import { BeneficiosPage } from "@/pages/BeneficiosPage";
import { ESocialPage } from "@/pages/ESocialPage";
import { RelatoriosPage } from "@/pages/RelatoriosPage";
import { ConfiguracoesPage } from "@/pages/ConfiguracoesPage";
import { LoginPage } from "@/pages/LoginPage";
export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <MainLayout />, children: [
    { index: true, element: <DashboardPage /> },
    { path: "colaboradores", element: <ColaboradoresPage /> },
    { path: "folha", element: <FolhaPagamentoPage /> },
    { path: "ferias", element: <FeriasPage /> },
    { path: "ponto", element: <PontoPage /> },
    { path: "beneficios", element: <BeneficiosPage /> },
    { path: "esocial", element: <ESocialPage /> },
    { path: "relatorios", element: <RelatoriosPage /> },
    { path: "configuracoes", element: <ConfiguracoesPage /> },
  ]},
]);
export default router;
