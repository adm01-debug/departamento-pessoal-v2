import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface UserContextType { state: any; setState: (value: any) => void; reset: () => void; }
const UserContext = createContext<UserContextType | undefined>(undefined);
export function UserContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <UserContext.Provider value={{ state, setState, reset }}>{children}</UserContext.Provider>;
}
export function useUserContext() { const context = useContext(UserContext); if (!context) throw new Error("useUserContext must be used within UserContextProvider"); return context; }
export default UserContext;
