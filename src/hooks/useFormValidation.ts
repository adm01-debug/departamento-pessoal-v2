import { useState, useCallback } from "react";
export type ValidationRule = { required?: boolean; minLength?: number; maxLength?: number; pattern?: RegExp; custom?: (value: any) => string | null; };
export type ValidationSchema<T> = { [K in keyof T]?: ValidationRule };
export function useFormValidation<T extends Record<string, any>>(schema: ValidationSchema<T>) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const validateField = useCallback((field: keyof T, value: any): string | null => {
    const rules = schema[field]; if (!rules) return null;
    if (rules.required && !value) return "Campo obrigatório";
    if (rules.minLength && String(value).length < rules.minLength) return `Mínimo ${rules.minLength} caracteres`;
    if (rules.maxLength && String(value).length > rules.maxLength) return `Máximo ${rules.maxLength} caracteres`;
    if (rules.pattern && !rules.pattern.test(String(value))) return "Formato inválido";
    if (rules.custom) return rules.custom(value);
    return null;
  }, [schema]);
  const validate = useCallback((data: Partial<T>): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    for (const field of Object.keys(schema) as (keyof T)[]) { const error = validateField(field, data[field]); if (error) { newErrors[field] = error; isValid = false; } }
    setErrors(newErrors); return isValid;
  }, [schema, validateField]);
  const clearErrors = useCallback(() => setErrors({}), []);
  return { errors, validate, validateField, clearErrors, hasErrors: Object.keys(errors).length > 0 };
}
export default useFormValidation;
