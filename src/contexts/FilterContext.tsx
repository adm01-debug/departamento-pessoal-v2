import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface FilterContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface FilterContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface FilterContextValue extends FilterContextState, FilterContextActions {}

const initialState: FilterContextState = { data: null, loading: false, error: null };

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FilterContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilterContext must be used within FilterContextProvider");
  return context;
}

export default FilterContext;
