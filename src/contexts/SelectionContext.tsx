import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface SelectionContextType { state: any; setState: (value: any) => void; reset: () => void; }
const SelectionContext = createContext<SelectionContextType | undefined>(undefined);
export function SelectionContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <SelectionContext.Provider value={{ state, setState, reset }}>{children}</SelectionContext.Provider>;
}
export function useSelectionContext() { const context = useContext(SelectionContext); if (!context) throw new Error("useSelectionContext must be used within SelectionContextProvider"); return context; }
export default SelectionContext;
