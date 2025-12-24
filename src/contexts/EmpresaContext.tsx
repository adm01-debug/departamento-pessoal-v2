import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Empresa } from '@/types/empresa';

interface EmpresaContextType {
  empresa: Empresa | null;
  empresas: Empresa[];
  isLoading: boolean;
  setEmpresa: (empresa: Empresa | null) => void;
  setEmpresas: (empresas: Empresa[]) => void;
  selectEmpresa: (id: string) => void;
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

interface EmpresaProviderProps {
  children: ReactNode;
}

export function EmpresaProvider({ children }: EmpresaProviderProps): JSX.Element {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectEmpresa = useCallback((id: string) => {
    const found = empresas.find(e => e.id === id);
    if (found) {
      setEmpresa(found);
    }
  }, [empresas]);

  return (
    <EmpresaContext.Provider value={{
      empresa,
      empresas,
      isLoading,
      setEmpresa,
      setEmpresas,
      selectEmpresa,
    }}>
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresaContext(): EmpresaContextType {
  const context = useContext(EmpresaContext);
  if (context === undefined) {
    throw new Error('useEmpresaContext must be used within an EmpresaProvider');
  }
  return context;
}
