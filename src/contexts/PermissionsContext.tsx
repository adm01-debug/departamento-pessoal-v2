import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface PermissionsContextState { data: any; loading: boolean; error: Error | null; }
interface PermissionsContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface PermissionsContextValue extends PermissionsContextState, PermissionsContextActions {}

const PermissionsContext = createContext<PermissionsContextValue | undefined>(undefined);

export function PermissionsContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PermissionsContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <PermissionsContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</PermissionsContext.Provider>;
}

export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsContextProvider");
  return ctx;
}

export { PermissionsContext };
export default PermissionsContext;
