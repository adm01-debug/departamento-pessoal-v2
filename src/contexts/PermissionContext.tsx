import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface PermissionContextType { state: any; setState: (v: any) => void; reset: () => void; }
const PermissionContext = createContext<PermissionContextType | undefined>(undefined);
export function PermissionContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <PermissionContext.Provider value={{ state, setState, reset }}>{children}</PermissionContext.Provider>;
}
export function usePermission() { const ctx = useContext(PermissionContext); if (!ctx) throw new Error("usePermission must be used within Provider"); return ctx; }
export { PermissionContext };
export default PermissionContext;
