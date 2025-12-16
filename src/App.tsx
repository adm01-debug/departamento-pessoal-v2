import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
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
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
