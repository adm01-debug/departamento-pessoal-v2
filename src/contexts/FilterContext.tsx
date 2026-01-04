import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface FilterContextState { data: any; loading: boolean; error: Error | null; }
interface FilterContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface FilterContextValue extends FilterContextState, FilterContextActions {}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FilterContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <FilterContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</FilterContext.Provider>;
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within FilterContextProvider");
  return ctx;
}

export { FilterContext };
export default FilterContext;
