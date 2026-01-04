import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface BreadcrumbContextState { data: any; loading: boolean; error: Error | null; }
interface BreadcrumbContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface BreadcrumbContextValue extends BreadcrumbContextState, BreadcrumbContextActions {}

const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(undefined);

export function BreadcrumbContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BreadcrumbContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <BreadcrumbContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</BreadcrumbContext.Provider>;
}

export function useBreadcrumb() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error("useBreadcrumb must be used within BreadcrumbContextProvider");
  return ctx;
}

export { BreadcrumbContext };
export default BreadcrumbContext;
