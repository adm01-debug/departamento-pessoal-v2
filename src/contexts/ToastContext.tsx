import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ToastContextType { state: any; setState: (v: any) => void; reset: () => void; }
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <ToastContext.Provider value={{ state, setState, reset }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastContextProvider");
  return ctx;
}

export { ToastContext };
export default ToastContext;
