import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface EmpresaContextType { state: any; setState: (v: any) => void; reset: () => void; }
const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);
export function EmpresaContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <EmpresaContext.Provider value={{ state, setState, reset }}>{children}</EmpresaContext.Provider>;
}
export function useEmpresa() { const ctx = useContext(EmpresaContext); if (!ctx) throw new Error("useEmpresa must be used within Provider"); return ctx; }
export { EmpresaContext };
export default EmpresaContext;
