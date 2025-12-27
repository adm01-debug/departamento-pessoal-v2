import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useIsOnline } from '@/hooks/useIsOnline';
describe('useIsOnline', () => { it('detecta online', () => { const { result } = renderHook(() => useIsOnline()); expect(typeof result.current).toBe('boolean'); }); });
