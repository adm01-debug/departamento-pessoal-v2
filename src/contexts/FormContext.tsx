import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface FormContextState { data: any; loading: boolean; error: Error | null; }
interface FormContextActions { setData: (d: any) => void; setLoading: (l: boolean) => void; setError: (e: Error | null) => void; reset: () => void; }
interface FormContextValue extends FormContextState, FormContextActions {}

const FormContext = createContext<FormContextValue | undefined>(undefined);

export function FormContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FormContextState>({ data: null, loading: false, error: null });
  const setData = useCallback((d: any) => setState(s => ({ ...s, data: d })), []);
  const setLoading = useCallback((l: boolean) => setState(s => ({ ...s, loading: l })), []);
  const setError = useCallback((e: Error | null) => setState(s => ({ ...s, error: e })), []);
  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);
  return <FormContext.Provider value={{ ...state, setData, setLoading, setError, reset }}>{children}</FormContext.Provider>;
}

export function useForm() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useForm must be used within FormContextProvider");
  return ctx;
}

export { FormContext };
export default FormContext;
