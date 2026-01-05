import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { EmpresaProvider } from "@/contexts/EmpresaContext";
import { CompetenciaProvider } from "@/contexts/CompetenciaContext";
import { Toaster } from "@/components/ui/toaster";
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 30, retry: 3, refetchOnWindowFocus: false } } });
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}><ThemeProvider><AuthProvider><EmpresaProvider><CompetenciaProvider><NotificationProvider>{children}<Toaster /></NotificationProvider></CompetenciaProvider></EmpresaProvider></AuthProvider></ThemeProvider><ReactQueryDevtools initialIsOpen={false} /></QueryClientProvider>
  );
}
export default AppProviders;
