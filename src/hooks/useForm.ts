// V15-142: src/hooks/useForm.ts
import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

type ValidationRules<T> = Partial<Record<keyof T, ((value: any) => string | null)[]>>;
type Errors<T> = Partial<Record<keyof T, string>>;

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: keyof T, value: any): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  }, [validationRules]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setValues(prev => ({ ...prev, [name]: newValue }));
    if (touched[name as keyof T]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name as keyof T, newValue) ?? undefined }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name as keyof T, value) ?? undefined }));
  }, [validateField]);

  const validateAll = useCallback((): boolean => {
    const newErrors: Errors<T> = {};
    let isValid = true;
    for (const key in validationRules) {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) { newErrors[key as keyof T] = error; isValid = false; }
    }
    setErrors(newErrors);
    return isValid;
  }, [validationRules, values, validateField]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsSubmitting(true);
    try { await onSubmit?.(values); }
    finally { setIsSubmitting(false); }
  }, [validateAll, onSubmit, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  return { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset, setValue, setValues };
}
