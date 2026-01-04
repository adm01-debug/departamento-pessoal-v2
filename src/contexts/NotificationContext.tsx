import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface NotificationContextType { state: any; setState: (value: any) => void; reset: () => void; }
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
export function NotificationContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <NotificationContext.Provider value={{ state, setState, reset }}>{children}</NotificationContext.Provider>;
}
export function useNotificationContext() { const context = useContext(NotificationContext); if (!context) throw new Error("useNotificationContext must be used within NotificationContextProvider"); return context; }
export default NotificationContext;
