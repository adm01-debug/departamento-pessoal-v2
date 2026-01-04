import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface WizardContextState { data: any; loading: boolean; error: Error | null; }
interface WizardContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface WizardContextValue extends WizardContextState, WizardContextActions {}

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export function WizardContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <WizardContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardContextProvider");
  return ctx;
}

export { WizardContext };
export default WizardContext;
