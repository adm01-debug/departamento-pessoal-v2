import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface FilterContextType { state: any; setState: (value: any) => void; reset: () => void; }
const FilterContext = createContext<FilterContextType | undefined>(undefined);
export function FilterContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <FilterContext.Provider value={{ state, setState, reset }}>{children}</FilterContext.Provider>;
}
export function useFilterContext() { const context = useContext(FilterContext); if (!context) throw new Error("useFilterContext must be used within FilterContextProvider"); return context; }
export default FilterContext;
