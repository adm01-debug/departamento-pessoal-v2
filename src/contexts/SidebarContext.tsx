import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface SidebarContextType { state: any; setState: (value: any) => void; reset: () => void; }
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
export function SidebarContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <SidebarContext.Provider value={{ state, setState, reset }}>{children}</SidebarContext.Provider>;
}
export function useSidebarContext() { const context = useContext(SidebarContext); if (!context) throw new Error("useSidebarContext must be used within SidebarContextProvider"); return context; }
export default SidebarContext;
