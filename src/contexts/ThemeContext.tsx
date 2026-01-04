import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ThemeContextState { data: any; loading: boolean; error: Error | null; }
interface ThemeContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface ThemeContextValue extends ThemeContextState, ThemeContextActions {}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <ThemeContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeContextProvider");
  return ctx;
}

export { ThemeContext };
export default ThemeContext;
