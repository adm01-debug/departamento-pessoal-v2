import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface SettingsContextType { state: any; setState: (v: any) => void; reset: () => void; }
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
export function SettingsContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <SettingsContext.Provider value={{ state, setState, reset }}>{children}</SettingsContext.Provider>;
}
export function useSettings() { const ctx = useContext(SettingsContext); if (!ctx) throw new Error("useSettings must be used within Provider"); return ctx; }
export { SettingsContext };
export default SettingsContext;
