import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface UndoRedoContextState { data: any; loading: boolean; error: Error | null; }
interface UndoRedoContextValue extends UndoRedoContextState { setData: (d: any) => void; setLoading: (l: boolean) => void; reset: () => void; }
const UndoRedoContext = createContext<UndoRedoContextValue | undefined>(undefined);
export function UndoRedoContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UndoRedoContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <UndoRedoContext.Provider value={{ ...state, setData, setLoading, reset }}>{children}</UndoRedoContext.Provider>;
}
export function useUndoRedo() { const c = useContext(UndoRedoContext); if (!c) throw new Error("useUndoRedo must be within Provider"); return c; }
export { UndoRedoContext };
export default UndoRedoContext;
