import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SearchContextType { state: any; setState: (v: any) => void; reset: () => void; }
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <SearchContext.Provider value={{ state, setState, reset }}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchContextProvider");
  return ctx;
}

export { SearchContext };
export default SearchContext;
