import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface UserContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface UserContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface UserContextValue extends UserContextState, UserContextActions {}

const initialState: UserContextState = { data: null, loading: false, error: null };

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used within UserContextProvider");
  return context;
}

export default UserContext;
