import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface TabContextType { state: any; setState: (v: any) => void; reset: () => void; }
const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <TabContext.Provider value={{ state, setState, reset }}>{children}</TabContext.Provider>;
}

export function useTab() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("useTab must be used within TabContextProvider");
  return ctx;
}

export { TabContext };
export default TabContext;
