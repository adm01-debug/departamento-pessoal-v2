import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface FilterContextType { state: any; setState: (v: any) => void; reset: () => void; }
const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <FilterContext.Provider value={{ state, setState, reset }}>{children}</FilterContext.Provider>;
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within FilterContextProvider");
  return ctx;
}

export { FilterContext };
export default FilterContext;
