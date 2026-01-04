import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface CompanyContextType { state: any; setState: (value: any) => void; reset: () => void; }
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);
export function CompanyContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <CompanyContext.Provider value={{ state, setState, reset }}>{children}</CompanyContext.Provider>;
}
export function useCompanyContext() { const context = useContext(CompanyContext); if (!context) throw new Error("useCompanyContext must be used within CompanyContextProvider"); return context; }
export default CompanyContext;
