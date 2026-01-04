import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface AuthContextType { state: any; setState: (value: any) => void; reset: () => void; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <AuthContext.Provider value={{ state, setState, reset }}>{children}</AuthContext.Provider>;
}
export function useAuthContext() { const context = useContext(AuthContext); if (!context) throw new Error("useAuthContext must be used within AuthContextProvider"); return context; }
export default AuthContext;
