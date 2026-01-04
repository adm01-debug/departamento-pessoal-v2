import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AccordionContextState { data: any; loading: boolean; error: Error | null; }
interface AccordionContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface AccordionContextValue extends AccordionContextState, AccordionContextActions {}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

export function AccordionContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccordionContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <AccordionContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</AccordionContext.Provider>;
}

export function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("useAccordion must be used within AccordionContextProvider");
  return ctx;
}

export { AccordionContext };
export default AccordionContext;
