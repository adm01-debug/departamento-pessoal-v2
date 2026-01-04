import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ModalContextState { data: any; loading: boolean; error: Error | null; }
interface ModalContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface ModalContextValue extends ModalContextState, ModalContextActions {}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <ModalContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalContextProvider");
  return ctx;
}

export { ModalContext };
export default ModalContext;
