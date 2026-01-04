import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface ToastContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface ToastContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface ToastContextValue extends ToastContextState, ToastContextActions {}

const initialState: ToastContextState = { data: null, loading: false, error: null };

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToastContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToastContext must be used within ToastContextProvider");
  return context;
}

export default ToastContext;
