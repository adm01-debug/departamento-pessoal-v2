import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface BreadcrumbContextType { state: any; setState: (v: any) => void; reset: () => void; }
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);
export function BreadcrumbContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <BreadcrumbContext.Provider value={{ state, setState, reset }}>{children}</BreadcrumbContext.Provider>;
}
export function useBreadcrumb() { const ctx = useContext(BreadcrumbContext); if (!ctx) throw new Error("useBreadcrumb must be used within Provider"); return ctx; }
export { BreadcrumbContext };
export default BreadcrumbContext;
