import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface SettingsContextType { state: any; setState: (value: any) => void; reset: () => void; }
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
export function SettingsContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <SettingsContext.Provider value={{ state, setState, reset }}>{children}</SettingsContext.Provider>;
}
export function useSettingsContext() { const context = useContext(SettingsContext); if (!context) throw new Error("useSettingsContext must be used within SettingsContextProvider"); return context; }
export default SettingsContext;
