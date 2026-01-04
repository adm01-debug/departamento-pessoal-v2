import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AuthContextType { state: any; setState: (v: any) => void; reset: () => void; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <AuthContext.Provider value={{ state, setState, reset }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthContextProvider");
  return ctx;
}

export { AuthContext };
export default AuthContext;
