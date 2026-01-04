import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface DrawerContextState { data: any; loading: boolean; error: Error | null; }
interface DrawerContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface DrawerContextValue extends DrawerContextState, DrawerContextActions {}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export function DrawerContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DrawerContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <DrawerContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</DrawerContext.Provider>;
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within DrawerContextProvider");
  return ctx;
}

export { DrawerContext };
export default DrawerContext;
