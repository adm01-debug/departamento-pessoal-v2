import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface PaginationContextState { data: any; loading: boolean; error: Error | null; }
interface PaginationContextValue extends PaginationContextState { setData: (d: any) => void; setLoading: (l: boolean) => void; reset: () => void; }
const PaginationContext = createContext<PaginationContextValue | undefined>(undefined);
export function PaginationContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PaginationContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <PaginationContext.Provider value={{ ...state, setData, setLoading, reset }}>{children}</PaginationContext.Provider>;
}
export function usePagination() { const c = useContext(PaginationContext); if (!c) throw new Error("usePagination must be within Provider"); return c; }
export { PaginationContext };
export default PaginationContext;
