import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface FormContextType { state: any; setState: (v: any) => void; reset: () => void; }
const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormContextProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<any>(null);
  const setState = useCallback((v: any) => setStateInternal(v), []);
  const reset = useCallback(() => setStateInternal(null), []);
  return <FormContext.Provider value={{ state, setState, reset }}>{children}</FormContext.Provider>;
}

export function useForm() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useForm must be used within FormContextProvider");
  return ctx;
}

export { FormContext };
export default FormContext;
