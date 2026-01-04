import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface DrawerContextType { state: any; setState: (v: any) => void; reset: () => void; }
const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <DrawerContext.Provider value={{ state, setState, reset }}>{children}</DrawerContext.Provider>;
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within DrawerContextProvider");
  return ctx;
}

export { DrawerContext };
export default DrawerContext;
