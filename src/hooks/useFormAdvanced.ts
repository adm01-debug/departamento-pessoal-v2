// V20-026: Hook useForm Avancado
import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

export interface FormConfig<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  setValue: (name: keyof T, value: T[keyof T]) => void;
  setError: (name: keyof T, error: string) => void;
  reset: () => void;
}

export function useForm<T extends Record<string, unknown>>(config: FormConfig<T>): UseFormReturn<T> {
  const { initialValues, validate, onSubmit } = config;
  
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runValidation = useCallback((vals: T) => {
    return validate ? validate(vals) : {};
  }, [validate]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setValues(v => ({ ...v, [name]: newValue }));
  }, []);

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    const errs = runValidation(values);
    setErrors(errs);
  }, [values, runValidation]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const errs = runValidation(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setIsSubmitting(true);
      try { await onSubmit(values); }
      finally { setIsSubmitting(false); }
    }
  }, [values, runValidation, onSubmit]);

  const setValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues(v => ({ ...v, [name]: value }));
  }, []);

  const setError = useCallback((name: keyof T, error: string) => {
    setErrors(e => ({ ...e, [name]: error }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  return { values, errors, touched, isSubmitting, isValid, handleChange, handleBlur, handleSubmit, setValue, setError, reset };
}

export default useForm;
