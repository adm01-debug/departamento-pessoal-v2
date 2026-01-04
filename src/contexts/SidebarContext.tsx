import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface SidebarContextType { state: any; setState: (v: any) => void; reset: () => void; }
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
export function SidebarContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <SidebarContext.Provider value={{ state, setState, reset }}>{children}</SidebarContext.Provider>;
}
export function useSidebar() { const ctx = useContext(SidebarContext); if (!ctx) throw new Error("useSidebar must be used within Provider"); return ctx; }
export { SidebarContext };
export default SidebarContext;
