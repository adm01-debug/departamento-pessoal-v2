import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface ConfigContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface ConfigContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface ConfigContextValue extends ConfigContextState, ConfigContextActions {}

const initialState: ConfigContextState = { data: null, loading: false, error: null };

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export function ConfigContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfigContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfigContext() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfigContext must be used within ConfigContextProvider");
  return context;
}

export default ConfigContext;
