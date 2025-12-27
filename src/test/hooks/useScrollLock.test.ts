import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useScrollLock } from '@/hooks/useScrollLock';
describe('useScrollLock', () => { it('trava scroll', () => { const { result } = renderHook(() => useScrollLock()); act(() => { result.current.lock(); }); act(() => { result.current.unlock(); }); }); });
