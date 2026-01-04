import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface NotificationsContextState { data: any; loading: boolean; error: Error | null; }
interface NotificationsContextValue extends NotificationsContextState { setData: (d: any) => void; setLoading: (l: boolean) => void; reset: () => void; }
const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);
export function NotificationsContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NotificationsContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <NotificationsContext.Provider value={{ ...state, setData, setLoading, reset }}>{children}</NotificationsContext.Provider>;
}
export function useNotifications() { const c = useContext(NotificationsContext); if (!c) throw new Error("useNotifications must be within Provider"); return c; }
export { NotificationsContext };
export default NotificationsContext;
