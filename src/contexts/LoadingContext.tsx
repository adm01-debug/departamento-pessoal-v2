import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface LoadingContextType { state: any; setState: (v: any) => void; reset: () => void; }
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <LoadingContext.Provider value={{ state, setState, reset }}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingContextProvider");
  return ctx;
}

export { LoadingContext };
export default LoadingContext;
