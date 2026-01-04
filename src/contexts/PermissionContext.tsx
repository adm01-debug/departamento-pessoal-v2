import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface PermissionContextState { data: any; loading: boolean; error: Error | null; }
interface PermissionContextValue extends PermissionContextState { setData: (d: any) => void; setLoading: (l: boolean) => void; reset: () => void; }
const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);
export function PermissionContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PermissionContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <PermissionContext.Provider value={{ ...state, setData, setLoading, reset }}>{children}</PermissionContext.Provider>;
}
export function usePermission() { const c = useContext(PermissionContext); if (!c) throw new Error("usePermission must be within Provider"); return c; }
export { PermissionContext };
export default PermissionContext;
