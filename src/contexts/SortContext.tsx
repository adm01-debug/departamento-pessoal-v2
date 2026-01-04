import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface SortContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface SortContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface SortContextValue extends SortContextState, SortContextActions {}

const initialState: SortContextState = { data: null, loading: false, error: null };

const SortContext = createContext<SortContextValue | undefined>(undefined);

export function SortContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SortContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <SortContext.Provider value={value}>{children}</SortContext.Provider>;
}

export function useSortContext() {
  const context = useContext(SortContext);
  if (!context) throw new Error("useSortContext must be used within SortContextProvider");
  return context;
}

export default SortContext;
