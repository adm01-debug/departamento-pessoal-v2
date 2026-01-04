import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ThemeContextType { state: any; setState: (v: any) => void; reset: () => void; }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <ThemeContext.Provider value={{ state, setState, reset }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeContextProvider");
  return ctx;
}

export { ThemeContext };
export default ThemeContext;
