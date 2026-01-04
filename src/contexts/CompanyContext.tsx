import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface CompanyContextType { state: any; setState: (v: any) => void; reset: () => void; }
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <CompanyContext.Provider value={{ state, setState, reset }}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyContextProvider");
  return ctx;
}

export { CompanyContext };
export default CompanyContext;
