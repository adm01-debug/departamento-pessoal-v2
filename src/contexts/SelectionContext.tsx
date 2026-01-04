import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface SelectionContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface SelectionContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface SelectionContextValue extends SelectionContextState, SelectionContextActions {}

const initialState: SelectionContextState = { data: null, loading: false, error: null };

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined);

export function SelectionContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SelectionContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelectionContext() {
  const context = useContext(SelectionContext);
  if (!context) throw new Error("useSelectionContext must be used within SelectionContextProvider");
  return context;
}

export default SelectionContext;
