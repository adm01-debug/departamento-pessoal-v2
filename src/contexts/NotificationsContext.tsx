import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface NotificationsContextType { state: any; setState: (v: any) => void; reset: () => void; }
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);
export function NotificationsContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <NotificationsContext.Provider value={{ state, setState, reset }}>{children}</NotificationsContext.Provider>;
}
export function useNotifications() { const ctx = useContext(NotificationsContext); if (!ctx) throw new Error("useNotifications must be used within Provider"); return ctx; }
export { NotificationsContext };
export default NotificationsContext;
