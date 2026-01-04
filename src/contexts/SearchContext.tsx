import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface SearchContextType { state: any; setState: (value: any) => void; reset: () => void; }
const SearchContext = createContext<SearchContextType | undefined>(undefined);
export function SearchContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <SearchContext.Provider value={{ state, setState, reset }}>{children}</SearchContext.Provider>;
}
export function useSearchContext() { const context = useContext(SearchContext); if (!context) throw new Error("useSearchContext must be used within SearchContextProvider"); return context; }
export default SearchContext;
