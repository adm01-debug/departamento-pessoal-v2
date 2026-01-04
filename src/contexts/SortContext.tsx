import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SortContextState { data: any; loading: boolean; error: Error | null; }
interface SortContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface SortContextValue extends SortContextState, SortContextActions {}

const SortContext = createContext<SortContextValue | undefined>(undefined);

export function SortContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SortContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <SortContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</SortContext.Provider>;
}

export function useSort() {
  const ctx = useContext(SortContext);
  if (!ctx) throw new Error("useSort must be used within SortContextProvider");
  return ctx;
}

export { SortContext };
export default SortContext;
