// V16: src/contexts/EmpresaContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Empresa {
  id: string;
  razao_social: string;
  nome_fantasia?: string | null;
  cnpj?: string | null;
  email?: string | null;
  telefone?: string | null;
  ativa?: boolean | null;
}

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
      const { data, error } = await supabase
        .from('empresas')
        .select('id, razao_social, nome_fantasia, cnpj, email, telefone, ativa')
        .eq('ativa', true)
        .order('razao_social');
      
      if (error) throw error;
      
      const fetchedEmpresas = data || [];
      setEmpresas(fetchedEmpresas);
      
      if (!empresaAtual && fetchedEmpresas.length > 0) {
        setEmpresaAtual(fetchedEmpresas[0]);
      }
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    refresh(); 
  }, []);

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