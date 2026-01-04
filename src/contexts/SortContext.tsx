import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SortContextType { state: any; setState: (v: any) => void; reset: () => void; }
const SortContext = createContext<SortContextType | undefined>(undefined);

export function SortContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <SortContext.Provider value={{ state, setState, reset }}>{children}</SortContext.Provider>;
}

export function useSort() {
  const ctx = useContext(SortContext);
  if (!ctx) throw new Error("useSort must be used within SortContextProvider");
  return ctx;
}

export { SortContext };
export default SortContext;
