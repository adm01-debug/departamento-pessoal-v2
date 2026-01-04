import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface NotificationContextType { state: any; setState: (v: any) => void; reset: () => void; }
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
export function NotificationContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <NotificationContext.Provider value={{ state, setState, reset }}>{children}</NotificationContext.Provider>;
}
export function useNotification() { const ctx = useContext(NotificationContext); if (!ctx) throw new Error("useNotification must be used within Provider"); return ctx; }
export { NotificationContext };
export default NotificationContext;
