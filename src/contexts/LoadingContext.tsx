import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface LoadingContextState { data: any; loading: boolean; error: Error | null; }
interface LoadingContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface LoadingContextValue extends LoadingContextState, LoadingContextActions {}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export function LoadingContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoadingContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <LoadingContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingContextProvider");
  return ctx;
}

export { LoadingContext };
export default LoadingContext;
