import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useOnboarding } from '@/hooks/useOnboarding';
describe('useOnboarding', () => { it('gerencia onboarding', () => { const { result } = renderHook(() => useOnboarding()); expect(result.current.isComplete).toBeDefined(); }); });
