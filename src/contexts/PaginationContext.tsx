import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface PaginationContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface PaginationContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface PaginationContextValue extends PaginationContextState, PaginationContextActions {}

const initialState: PaginationContextState = { data: null, loading: false, error: null };

const PaginationContext = createContext<PaginationContextValue | undefined>(undefined);

export function PaginationContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PaginationContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <PaginationContext.Provider value={value}>{children}</PaginationContext.Provider>;
}

export function usePaginationContext() {
  const context = useContext(PaginationContext);
  if (!context) throw new Error("usePaginationContext must be used within PaginationContextProvider");
  return context;
}

export default PaginationContext;
