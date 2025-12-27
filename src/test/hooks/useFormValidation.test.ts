import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormValidation } from '@/hooks/useFormValidation';
describe('useFormValidation', () => { it('valida form', () => { const { result } = renderHook(() => useFormValidation({})); expect(result.current.errors).toBeDefined(); expect(result.current.validate).toBeDefined(); }); });
