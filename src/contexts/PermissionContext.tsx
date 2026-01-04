import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface PermissionContextType { state: any; setState: (value: any) => void; reset: () => void; }
const PermissionContext = createContext<PermissionContextType | undefined>(undefined);
export function PermissionContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <PermissionContext.Provider value={{ state, setState, reset }}>{children}</PermissionContext.Provider>;
}
export function usePermissionContext() { const context = useContext(PermissionContext); if (!context) throw new Error("usePermissionContext must be used within PermissionContextProvider"); return context; }
export default PermissionContext;
