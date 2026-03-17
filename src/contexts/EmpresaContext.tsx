import React, { createContext, useContext, ReactNode } from 'react';
import { useEmpresas, type Empresa } from '@/hooks/useEmpresas';

interface EmpresaContextType {
  empresas: Empresa[];
  empresaAtual: Empresa | null;
  loading: boolean;
  setEmpresaAtual: (empresa: Empresa | null) => void;
  refresh: () => Promise<void>;
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

/**
 * EmpresaProvider now delegates 100% to useEmpresas (Zustand + React Query).
 * This eliminates the dual-state problem (C1/M1) — both useEmpresa() and
 * useEmpresas() now share the same single source of truth.
 */
export function EmpresaProvider({ children }: { children: ReactNode }) {
  const {
    userEmpresas,
    empresaAtual,
    loadingEmpresas,
    trocarEmpresa,
  } = useEmpresas();

  // Map userEmpresas to flat Empresa[] for backward compat
  const empresas: Empresa[] = (userEmpresas || [])
    .map(ue => ue.empresa)
    .filter((e): e is Empresa => !!e);

  const setEmpresaAtual = (empresa: Empresa | null) => {
    if (empresa) trocarEmpresa(empresa.id);
  };

  const refresh = async () => {
    // React Query handles refetching automatically via invalidateQueries
  };

  return (
    <EmpresaContext.Provider
      value={{
        empresas,
        empresaAtual: empresaAtual ?? null,
        loading: loadingEmpresas,
        setEmpresaAtual,
        refresh,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresa() {
  const context = useContext(EmpresaContext);
  if (!context) throw new Error('useEmpresa must be used within EmpresaProvider');
  return context;
}
