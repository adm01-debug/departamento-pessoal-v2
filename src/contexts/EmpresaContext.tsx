import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface EmpresaContextState { data: any; loading: boolean; error: Error | null; }
interface EmpresaContextValue extends EmpresaContextState { setData: (d: any) => void; setLoading: (l: boolean) => void; reset: () => void; }
const EmpresaContext = createContext<EmpresaContextValue | undefined>(undefined);
export function EmpresaContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EmpresaContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <EmpresaContext.Provider value={{ ...state, setData, setLoading, reset }}>{children}</EmpresaContext.Provider>;
}
export function useEmpresa() { const c = useContext(EmpresaContext); if (!c) throw new Error("useEmpresa must be within Provider"); return c; }
export { EmpresaContext };
export default EmpresaContext;
