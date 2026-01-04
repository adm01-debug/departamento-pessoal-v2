import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface SidebarContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface SidebarContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface SidebarContextValue extends SidebarContextState, SidebarContextActions {}

const initialState: SidebarContextState = { data: null, loading: false, error: null };

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SidebarContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebarContext must be used within SidebarContextProvider");
  return context;
}

export default SidebarContext;
