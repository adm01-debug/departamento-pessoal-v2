import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface CompanyContextState { data: any; loading: boolean; error: Error | null; }
interface CompanyContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface CompanyContextValue extends CompanyContextState, CompanyContextActions {}

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);

export function CompanyContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CompanyContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <CompanyContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyContextProvider");
  return ctx;
}

export { CompanyContext };
export default CompanyContext;
