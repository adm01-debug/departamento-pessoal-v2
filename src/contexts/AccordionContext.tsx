import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface AccordionContextType { state: any; setState: (value: any) => void; reset: () => void; }
const AccordionContext = createContext<AccordionContextType | undefined>(undefined);
export function AccordionContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <AccordionContext.Provider value={{ state, setState, reset }}>{children}</AccordionContext.Provider>;
}
export function useAccordionContext() { const context = useContext(AccordionContext); if (!context) throw new Error("useAccordionContext must be used within AccordionContextProvider"); return context; }
export default AccordionContext;
