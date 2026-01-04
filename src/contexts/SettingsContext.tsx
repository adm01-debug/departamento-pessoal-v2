import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SettingsContextState { data: any; loading: boolean; error: Error | null; }
interface SettingsContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface SettingsContextValue extends SettingsContextState, SettingsContextActions {}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SettingsContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <SettingsContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsContextProvider");
  return ctx;
}

export { SettingsContext };
export default SettingsContext;
