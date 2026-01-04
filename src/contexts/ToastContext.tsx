import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface ToastContextType { state: any; setState: (value: any) => void; reset: () => void; }
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export function ToastContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <ToastContext.Provider value={{ state, setState, reset }}>{children}</ToastContext.Provider>;
}
export function useToastContext() { const context = useContext(ToastContext); if (!context) throw new Error("useToastContext must be used within ToastContextProvider"); return context; }
export default ToastContext;
