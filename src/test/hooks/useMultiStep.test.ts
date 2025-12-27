import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMultiStep } from '@/hooks/useMultiStep';
describe('useMultiStep', () => { it('gerencia steps', () => { const { result } = renderHook(() => useMultiStep(3)); expect(result.current.currentStep).toBe(0); act(() => { result.current.next(); }); expect(result.current.currentStep).toBe(1); }); });
