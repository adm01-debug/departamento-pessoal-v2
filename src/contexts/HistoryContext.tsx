import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface HistoryContextType { state: any; setState: (v: any) => void; reset: () => void; }
const HistoryContext = createContext<HistoryContextType | undefined>(undefined);
export function HistoryContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <HistoryContext.Provider value={{ state, setState, reset }}>{children}</HistoryContext.Provider>;
}
export function useHistory() { const ctx = useContext(HistoryContext); if (!ctx) throw new Error("useHistory must be used within Provider"); return ctx; }
export { HistoryContext };
export default HistoryContext;
