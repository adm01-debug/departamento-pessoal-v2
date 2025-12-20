import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Colaboradores from "./pages/Colaboradores";
import Admissao from "./pages/Admissao";
import Ponto from "./pages/Ponto";
import Ferias from "./pages/Ferias";
import Afastamentos from "./pages/Afastamentos";
import Folha from "./pages/Folha";
import Beneficios from "./pages/Beneficios";
import Desligamento from "./pages/Desligamento";
import Relatorios from "./pages/Relatorios";
import Auditoria from "./pages/Auditoria";
import FeriadosPage from "./pages/Feriados";
import Perfil from "./pages/Perfil";
import Usuarios from "./pages/Usuarios";
import Assinaturas from "./pages/Assinaturas";
import PortalColaborador from "./pages/PortalColaborador";
import Organograma from "./pages/Organograma";
import Onboarding from "./pages/Onboarding";
import GestaoDocumentos from "./pages/GestaoDocumentos";
import IntegracaoContabil from "./pages/IntegracaoContabil";
import ContratacaoDigital from "./pages/ContratacaoDigital";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/contratacao" element={<ContratacaoDigital />} />
              <Route element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route path="/" element={<Dashboard />} />
                <Route path="/colaboradores" element={<Colaboradores />} />
                <Route path="/admissao" element={<Admissao />} />
                <Route path="/ponto" element={<Ponto />} />
                <Route path="/ferias" element={<Ferias />} />
                <Route path="/afastamentos" element={<Afastamentos />} />
                <Route path="/folha" element={<Folha />} />
                <Route path="/beneficios" element={<Beneficios />} />
                <Route path="/desligamento" element={<Desligamento />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/auditoria" element={<Auditoria />} />
                <Route path="/feriados" element={<FeriadosPage />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/assinaturas" element={<Assinaturas />} />
                <Route path="/portal" element={<PortalColaborador />} />
                <Route path="/organograma" element={<Organograma />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/documentos" element={<GestaoDocumentos />} />
                <Route path="/contabil" element={<IntegracaoContabil />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
