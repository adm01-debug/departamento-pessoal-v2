import { useState, useCallback } from 'react';
import { z } from 'zod';
import { 
  colaboradorSchema, 
  feriasSchema, 
  afastamentoSchema, 
  desligamentoSchema,
  registroPontoSchema,
  beneficioSchema,
  lancamentoFolhaSchema,
  formatZodErrors 
} from '@/lib/validationSchemas';

// ============================================
// HOOK GENÉRICO DE VALIDAÇÃO
// ============================================

export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  const validate = useCallback((data: unknown): { success: boolean; data?: T; errors?: Record<string, string> } => {
    const result = schema.safeParse(data);
    
    if (result.success) {
      setErrors({});
      setIsValid(true);
      return { success: true, data: result.data };
    }
    
    const formattedErrors = formatZodErrors(result.error);
    setErrors(formattedErrors);
    setIsValid(false);
    return { success: false, errors: formattedErrors };
  }, [schema]);

  const validateField = useCallback((field: string, value: unknown, fullData?: unknown): string | null => {
    try {
      // Tenta validar apenas o campo se possível
      const partialSchema = (schema as { pick?: (fields: Record<string, boolean>) => unknown }).pick?.({ [field]: true });
      if (partialSchema) {
        partialSchema.parse({ [field]: value });
      } else if (fullData) {
        schema.parse(fullData);
      }
      
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
      return null;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldError = e.errors.find(err => err.path.includes(field));
        if (fieldError) {
          setErrors(prev => ({ ...prev, [field]: fieldError.message }));
          return fieldError.message;
        }
      }
      return null;
    }
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  const getError = useCallback((field: string): string | undefined => {
    return errors[field];
  }, [errors]);

  const hasError = useCallback((field: string): boolean => {
    return !!errors[field];
  }, [errors]);

  return {
    errors,
    isValid,
    validate,
    validateField,
    clearErrors,
    getError,
    hasError,
  };
}

// ============================================
// HOOKS PRÉ-CONFIGURADOS
// ============================================

export function useColaboradorValidation() {
  return useFormValidation(colaboradorSchema);
}

export function useFeriasValidation() {
  return useFormValidation(feriasSchema);
}

export function useAfastamentoValidation() {
  return useFormValidation(afastamentoSchema);
}

export function useDesligamentoValidation() {
  return useFormValidation(desligamentoSchema);
}

export function useRegistroPontoValidation() {
  return useFormValidation(registroPontoSchema);
}

export function useBeneficioValidation() {
  return useFormValidation(beneficioSchema);
}

export function useLancamentoFolhaValidation() {
  return useFormValidation(lancamentoFolhaSchema);
}

// ============================================
// VALIDADORES SIMPLES (para uso inline)
// ============================================

import { validateCPF, validatePIS } from '@/lib/validationSchemas';

export function useSimpleValidators() {
  const validateCpf = useCallback((cpf: string): { valid: boolean; error?: string } => {
    if (!cpf) return { valid: true };
    const isValid = validateCPF(cpf);
    return { valid: isValid, error: isValid ? undefined : 'CPF inválido' };
  }, []);

  const validatePis = useCallback((pis: string): { valid: boolean; error?: string } => {
    if (!pis) return { valid: true };
    const isValid = validatePIS(pis);
    return { valid: isValid, error: isValid ? undefined : 'PIS inválido' };
  }, []);

  const validateEmail = useCallback((email: string): { valid: boolean; error?: string } => {
    if (!email) return { valid: true };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return { valid: isValid, error: isValid ? undefined : 'Email inválido' };
  }, []);

  const validateTelefone = useCallback((tel: string): { valid: boolean; error?: string } => {
    if (!tel) return { valid: true };
    const telRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/;
    const isValid = telRegex.test(tel);
    return { valid: isValid, error: isValid ? undefined : 'Telefone inválido. Use: (99) 99999-9999' };
  }, []);

  const validateCep = useCallback((cep: string): { valid: boolean; error?: string } => {
    if (!cep) return { valid: true };
    const cepRegex = /^\d{5}-?\d{3}$/;
    const isValid = cepRegex.test(cep);
    return { valid: isValid, error: isValid ? undefined : 'CEP inválido. Use: 99999-999' };
  }, []);

  const validateData = useCallback((data: string): { valid: boolean; error?: string } => {
    if (!data) return { valid: true };
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data)) {
      return { valid: false, error: 'Data inválida' };
    }
    const parsed = Date.parse(data);
    if (isNaN(parsed)) {
      return { valid: false, error: 'Data inválida' };
    }
    return { valid: true };
  }, []);

  const validateSalario = useCallback((salario: number): { valid: boolean; error?: string } => {
    if (salario < 1412) {
      return { valid: false, error: 'Salário não pode ser menor que o mínimo (R$ 1.412,00)' };
    }
    if (salario > 999999999) {
      return { valid: false, error: 'Salário muito alto' };
    }
    return { valid: true };
  }, []);

  return {
    validateCpf,
    validatePis,
    validateEmail,
    validateTelefone,
    validateCep,
    validateData,
    validateSalario,
  };
}
