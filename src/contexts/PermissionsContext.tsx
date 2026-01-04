import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface PermissionsContextType { state: any; setState: (v: any) => void; reset: () => void; }
const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <PermissionsContext.Provider value={{ state, setState, reset }}>{children}</PermissionsContext.Provider>;
}

export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsContextProvider");
  return ctx;
}

export { PermissionsContext };
export default PermissionsContext;
