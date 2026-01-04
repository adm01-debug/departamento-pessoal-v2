import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface WizardContextType { state: any; setState: (v: any) => void; reset: () => void; }
const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <WizardContext.Provider value={{ state, setState, reset }}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardContextProvider");
  return ctx;
}

export { WizardContext };
export default WizardContext;
