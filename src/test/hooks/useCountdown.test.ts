import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCountdown } from '@/hooks/useCountdown';
describe('useCountdown', () => { it('conta regressivamente', () => { vi.useFakeTimers(); const { result } = renderHook(() => useCountdown(10)); expect(result.current.count).toBe(10); vi.useRealTimers(); }); });
