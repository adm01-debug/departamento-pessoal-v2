import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface PaginationContextType { state: any; setState: (v: any) => void; reset: () => void; }
const PaginationContext = createContext<PaginationContextType | undefined>(undefined);
export function PaginationContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <PaginationContext.Provider value={{ state, setState, reset }}>{children}</PaginationContext.Provider>;
}
export function usePagination() { const ctx = useContext(PaginationContext); if (!ctx) throw new Error("usePagination must be used within Provider"); return ctx; }
export { PaginationContext };
export default PaginationContext;
