import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface TabContextType { state: any; setState: (value: any) => void; reset: () => void; }
const TabContext = createContext<TabContextType | undefined>(undefined);
export function TabContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <TabContext.Provider value={{ state, setState, reset }}>{children}</TabContext.Provider>;
}
export function useTabContext() { const context = useContext(TabContext); if (!context) throw new Error("useTabContext must be used within TabContextProvider"); return context; }
export default TabContext;
