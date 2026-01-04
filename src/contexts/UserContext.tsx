import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface UserContextType { state: any; setState: (v: any) => void; reset: () => void; }
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <UserContext.Provider value={{ state, setState, reset }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserContextProvider");
  return ctx;
}

export { UserContext };
export default UserContext;
