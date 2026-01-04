import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface SortContextType { state: any; setState: (value: any) => void; reset: () => void; }
const SortContext = createContext<SortContextType | undefined>(undefined);
export function SortContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <SortContext.Provider value={{ state, setState, reset }}>{children}</SortContext.Provider>;
}
export function useSortContext() { const context = useContext(SortContext); if (!context) throw new Error("useSortContext must be used within SortContextProvider"); return context; }
export default SortContext;
