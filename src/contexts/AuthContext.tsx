import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface AuthContextState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface AuthContextActions {
  setData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  refresh: () => Promise<void>;
}

interface AuthContextValue extends AuthContextState, AuthContextActions {}

const initialState: AuthContextState = { data: null, loading: false, error: null };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthContextState>(initialState);

  const setData = useCallback((data: any) => setState(prev => ({ ...prev, data })), []);
  const setLoading = useCallback((loading: boolean) => setState(prev => ({ ...prev, loading })), []);
  const setError = useCallback((error: string | null) => setState(prev => ({ ...prev, error })), []);
  const reset = useCallback(() => setState(initialState), []);
  const refresh = useCallback(async () => { setLoading(true); try { /* fetch */ } finally { setLoading(false); } }, [setLoading]);

  const value = useMemo(() => ({ ...state, setData, setLoading, setError, reset, refresh }), [state, setData, setLoading, setError, reset, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthContextProvider");
  return context;
}

export default AuthContext;
