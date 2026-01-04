import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface ThemeContextType { state: any; setState: (value: any) => void; reset: () => void; }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <ThemeContext.Provider value={{ state, setState, reset }}>{children}</ThemeContext.Provider>;
}
export function useThemeContext() { const context = useContext(ThemeContext); if (!context) throw new Error("useThemeContext must be used within ThemeContextProvider"); return context; }
export default ThemeContext;
