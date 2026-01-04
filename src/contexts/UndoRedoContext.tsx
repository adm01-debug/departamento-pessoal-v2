import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface UndoRedoContextType { state: any; setState: (v: any) => void; reset: () => void; }
const UndoRedoContext = createContext<UndoRedoContextType | undefined>(undefined);
export function UndoRedoContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <UndoRedoContext.Provider value={{ state, setState, reset }}>{children}</UndoRedoContext.Provider>;
}
export function useUndoRedo() { const ctx = useContext(UndoRedoContext); if (!ctx) throw new Error("useUndoRedo must be used within Provider"); return ctx; }
export { UndoRedoContext };
export default UndoRedoContext;
