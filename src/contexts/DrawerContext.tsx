import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface DrawerContextType { state: any; setState: (value: any) => void; reset: () => void; }
const DrawerContext = createContext<DrawerContextType | undefined>(undefined);
export function DrawerContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <DrawerContext.Provider value={{ state, setState, reset }}>{children}</DrawerContext.Provider>;
}
export function useDrawerContext() { const context = useContext(DrawerContext); if (!context) throw new Error("useDrawerContext must be used within DrawerContextProvider"); return context; }
export default DrawerContext;
