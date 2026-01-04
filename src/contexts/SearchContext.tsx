import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SearchContextState { data: any; loading: boolean; error: Error | null; }
interface SearchContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface SearchContextValue extends SearchContextState, SearchContextActions {}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SearchContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <SearchContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchContextProvider");
  return ctx;
}

export { SearchContext };
export default SearchContext;
