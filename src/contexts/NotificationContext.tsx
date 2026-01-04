import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface NotificationContextState { data: any; loading: boolean; error: Error | null; }
interface NotificationContextValue extends NotificationContextState { setData: (d: any) => void; setLoading: (l: boolean) => void; reset: () => void; }
const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);
export function NotificationContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NotificationContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <NotificationContext.Provider value={{ ...state, setData, setLoading, reset }}>{children}</NotificationContext.Provider>;
}
export function useNotification() { const c = useContext(NotificationContext); if (!c) throw new Error("useNotification must be within Provider"); return c; }
export { NotificationContext };
export default NotificationContext;
