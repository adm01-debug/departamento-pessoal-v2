import { lazy, Suspense } from "react";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const TwoFactorSetup = lazy(() => import("./pages/TwoFactorSetup"));
const RateLimitDashboard = lazy(() => import("./pages/RateLimitDashboard"));
const Colaboradores = lazy(() => import("./pages/Colaboradores"));
const Admissao = lazy(() => import("./pages/Admissao"));
const Ponto = lazy(() => import("./pages/Ponto"));
const Ferias = lazy(() => import("./pages/Ferias"));
const Afastamentos = lazy(() => import("./pages/Afastamentos"));
const Folha = lazy(() => import("./pages/Folha"));
const Beneficios = lazy(() => import("./pages/Beneficios"));
const Desligamento = lazy(() => import("./pages/Desligamento"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const Auditoria = lazy(() => import("./pages/Auditoria"));
const FeriadosPage = lazy(() => import("./pages/Feriados"));
const Perfil = lazy(() => import("./pages/Perfil"));
const Usuarios = lazy(() => import("./pages/Usuarios"));
const Assinaturas = lazy(() => import("./pages/Assinaturas"));
const PortalColaborador = lazy(() => import("./pages/PortalColaborador"));
const Organograma = lazy(() => import("./pages/Organograma"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const GestaoDocumentos = lazy(() => import("./pages/GestaoDocumentos"));
const IntegracaoContabil = lazy(() => import("./pages/IntegracaoContabil"));
const ContratacaoDigital = lazy(() => import("./pages/ContratacaoDigital"));
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);



const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
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
                <Route path="/2fa-setup" element={<TwoFactorSetup />} />
                <Route path="/seguranca" element={<RateLimitDashboard />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;



