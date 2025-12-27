import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormPersist } from '@/hooks/useFormPersist';
describe('useFormPersist', () => { it('persiste form', () => { const { result } = renderHook(() => useFormPersist('test-form')); expect(result.current.save).toBeDefined(); expect(result.current.load).toBeDefined(); }); });
