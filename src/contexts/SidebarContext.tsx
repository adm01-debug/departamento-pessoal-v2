import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SidebarContextState { data: any; loading: boolean; error: Error | null; }
interface SidebarContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface SidebarContextValue extends SidebarContextState, SidebarContextActions {}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SidebarContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <SidebarContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarContextProvider");
  return ctx;
}

export { SidebarContext };
export default SidebarContext;
