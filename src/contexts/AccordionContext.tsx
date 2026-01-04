import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface AccordionContextType { state: any; setState: (v: any) => void; reset: () => void; }
const AccordionContext = createContext<AccordionContextType | undefined>(undefined);
export function AccordionContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <AccordionContext.Provider value={{ state, setState, reset }}>{children}</AccordionContext.Provider>;
}
export function useAccordion() { const ctx = useContext(AccordionContext); if (!ctx) throw new Error("useAccordion must be used within Provider"); return ctx; }
export { AccordionContext };
export default AccordionContext;
