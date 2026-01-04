import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface EmpresaContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface EmpresaContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface EmpresaContextValue extends EmpresaContextState, EmpresaContextActions {}

const initialState: EmpresaContextState = { data: null, loading: false, error: null };

const EmpresaContext = createContext<EmpresaContextValue | undefined>(undefined);

export function EmpresaContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EmpresaContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <EmpresaContext.Provider value={value}>{children}</EmpresaContext.Provider>;
}

export function useEmpresaContext() {
  const context = useContext(EmpresaContext);
  if (!context) throw new Error("useEmpresaContext must be used within EmpresaContextProvider");
  return context;
}

export default EmpresaContext;
