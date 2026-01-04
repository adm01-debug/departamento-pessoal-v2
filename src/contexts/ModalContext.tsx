import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface ModalContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface ModalContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface ModalContextValue extends ModalContextState, ModalContextActions {}

const initialState: ModalContextState = { data: null, loading: false, error: null };

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModalContext must be used within ModalContextProvider");
  return context;
}

export default ModalContext;
