import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface TabContextState { data: any; loading: boolean; error: Error | null; }
interface TabContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface TabContextValue extends TabContextState, TabContextActions {}

const TabContext = createContext<TabContextValue | undefined>(undefined);

export function TabContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TabContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <TabContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</TabContext.Provider>;
}

export function useTab() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("useTab must be used within TabContextProvider");
  return ctx;
}

export { TabContext };
export default TabContext;
