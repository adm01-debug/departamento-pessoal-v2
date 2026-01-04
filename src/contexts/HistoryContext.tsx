import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface HistoryContextState { data: any; loading: boolean; error: Error | null; }
interface HistoryContextValue extends HistoryContextState { setData: (d: any) => void; setLoading: (l: boolean) => void; reset: () => void; }
const HistoryContext = createContext<HistoryContextValue | undefined>(undefined);
export function HistoryContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HistoryContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <HistoryContext.Provider value={{ ...state, setData, setLoading, reset }}>{children}</HistoryContext.Provider>;
}
export function useHistory() { const c = useContext(HistoryContext); if (!c) throw new Error("useHistory must be within Provider"); return c; }
export { HistoryContext };
export default HistoryContext;
