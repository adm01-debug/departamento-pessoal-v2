import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SelectionContextState { data: any; loading: boolean; error: Error | null; }
interface SelectionContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface SelectionContextValue extends SelectionContextState, SelectionContextActions {}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined);

export function SelectionContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SelectionContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <SelectionContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within SelectionContextProvider");
  return ctx;
}

export { SelectionContext };
export default SelectionContext;
