import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ModalContextType { state: any; setState: (v: any) => void; reset: () => void; }
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <ModalContext.Provider value={{ state, setState, reset }}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalContextProvider");
  return ctx;
}

export { ModalContext };
export default ModalContext;
