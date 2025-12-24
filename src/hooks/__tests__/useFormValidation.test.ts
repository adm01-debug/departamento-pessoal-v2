import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../useFormValidation';
import { z } from 'zod';

const testSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  idade: z.number().min(18, 'Deve ser maior de idade'),
});

describe('useFormValidation', () => {
  it('should initialize with empty errors', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));
    expect(result.current.errors).toEqual({});
  });

  it('should validate field correctly', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));
    
    act(() => {
      result.current.validateField('nome', 'ab');
    });
    
    expect(result.current.errors.nome).toBeDefined();
  });

  it('should clear errors when valid', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));
    
    act(() => {
      result.current.validateField('nome', 'ab');
    });
    expect(result.current.errors.nome).toBeDefined();
    
    act(() => {
      result.current.validateField('nome', 'João');
    });
    expect(result.current.errors.nome).toBeUndefined();
  });

  it('should validate all fields', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));
    
    act(() => {
      const isValid = result.current.validateAll({ nome: 'ab', email: 'invalid', idade: 16 });
      expect(isValid).toBe(false);
    });
    
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('should return true for valid data', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));
    
    act(() => {
      const isValid = result.current.validateAll({ nome: 'João Silva', email: 'joao@email.com', idade: 25 });
      expect(isValid).toBe(true);
    });
    
    expect(result.current.errors).toEqual({});
  });

  it('should reset errors', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));
    
    act(() => {
      result.current.validateField('nome', 'ab');
    });
    expect(result.current.errors.nome).toBeDefined();
    
    act(() => {
      result.current.resetErrors();
    });
    expect(result.current.errors).toEqual({});
  });
});
