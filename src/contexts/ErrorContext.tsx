import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface ErrorContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface ErrorContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface ErrorContextValue extends ErrorContextState, ErrorContextActions {}

const initialState: ErrorContextState = { data: null, loading: false, error: null };

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export function ErrorContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ErrorContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
}

export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (!context) throw new Error("useErrorContext must be used within ErrorContextProvider");
  return context;
}

export default ErrorContext;
