import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useKeyPress } from '@/hooks/useKeyPress';
describe('useKeyPress', () => { it('detecta tecla', () => { const { result } = renderHook(() => useKeyPress('Enter')); expect(typeof result.current).toBe('boolean'); }); });
