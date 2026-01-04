import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface SelectionContextType { state: any; setState: (v: any) => void; reset: () => void; }
const SelectionContext = createContext<SelectionContextType | undefined>(undefined);
export function SelectionContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <SelectionContext.Provider value={{ state, setState, reset }}>{children}</SelectionContext.Provider>;
}
export function useSelection() { const ctx = useContext(SelectionContext); if (!ctx) throw new Error("useSelection must be used within Provider"); return ctx; }
export { SelectionContext };
export default SelectionContext;
