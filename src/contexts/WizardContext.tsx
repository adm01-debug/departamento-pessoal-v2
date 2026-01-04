import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface WizardContextType { state: any; setState: (value: any) => void; reset: () => void; }
const WizardContext = createContext<WizardContextType | undefined>(undefined);
export function WizardContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <WizardContext.Provider value={{ state, setState, reset }}>{children}</WizardContext.Provider>;
}
export function useWizardContext() { const context = useContext(WizardContext); if (!context) throw new Error("useWizardContext must be used within WizardContextProvider"); return context; }
export default WizardContext;
