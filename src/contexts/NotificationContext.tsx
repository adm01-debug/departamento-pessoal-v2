import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface NotificationContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface NotificationContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface NotificationContextValue extends NotificationContextState, NotificationContextActions {}

const initialState: NotificationContextState = { data: null, loading: false, error: null };

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NotificationContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotificationContext must be used within NotificationContextProvider");
  return context;
}

export default NotificationContext;
