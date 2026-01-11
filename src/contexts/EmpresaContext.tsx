// V15-217: src/contexts/EmpresaContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { empresaService } from '@/services';
import type { Empresa } from '@/types';

interface EmpresaContextType {
  empresas: Empresa[];
  empresaAtual: Empresa | null;
  loading: boolean;
  setEmpresaAtual: (empresa: Empresa | null) => void;
  refresh: () => Promise<void>;
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

export function EmpresaProvider({ children }: { children: ReactNode }) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaAtual, setEmpresaAtual] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await empresaService.list();
      setEmpresas(data);
      if (!empresaAtual && data.length > 0) {
        setEmpresaAtual(data[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  return (
    <EmpresaContext.Provider value={{ empresas, empresaAtual, loading, setEmpresaAtual, refresh }}>
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresa() {
  const context = useContext(EmpresaContext);
  if (!context) throw new Error('useEmpresa must be used within EmpresaProvider');
  return context;
}
