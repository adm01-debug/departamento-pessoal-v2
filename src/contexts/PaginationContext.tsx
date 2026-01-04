import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface PaginationContextType { state: any; setState: (value: any) => void; reset: () => void; }
const PaginationContext = createContext<PaginationContextType | undefined>(undefined);
export function PaginationContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <PaginationContext.Provider value={{ state, setState, reset }}>{children}</PaginationContext.Provider>;
}
export function usePaginationContext() { const context = useContext(PaginationContext); if (!context) throw new Error("usePaginationContext must be used within PaginationContextProvider"); return context; }
export default PaginationContext;
