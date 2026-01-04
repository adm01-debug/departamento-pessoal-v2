import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface ModalContextType { state: any; setState: (value: any) => void; reset: () => void; }
const ModalContext = createContext<ModalContextType | undefined>(undefined);
export function ModalContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <ModalContext.Provider value={{ state, setState, reset }}>{children}</ModalContext.Provider>;
}
export function useModalContext() { const context = useContext(ModalContext); if (!context) throw new Error("useModalContext must be used within ModalContextProvider"); return context; }
export default ModalContext;
