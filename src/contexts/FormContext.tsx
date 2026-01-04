import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface FormContextType { state: any; setState: (value: any) => void; reset: () => void; }
const FormContext = createContext<FormContextType | undefined>(undefined);
export function FormContextProvider({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [state, setState] = useState(initialState || {});
  const reset = useCallback(() => setState(initialState || {}), [initialState]);
  return <FormContext.Provider value={{ state, setState, reset }}>{children}</FormContext.Provider>;
}
export function useFormContext() { const context = useContext(FormContext); if (!context) throw new Error("useFormContext must be used within FormContextProvider"); return context; }
export default FormContext;
