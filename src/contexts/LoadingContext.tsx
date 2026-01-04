import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface LoadingContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface LoadingContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface LoadingContextValue extends LoadingContextState, LoadingContextActions {}

const initialState: LoadingContextState = { data: null, loading: false, error: null };

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export function LoadingContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoadingContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoadingContext must be used within LoadingContextProvider");
  return context;
}

export default LoadingContext;
