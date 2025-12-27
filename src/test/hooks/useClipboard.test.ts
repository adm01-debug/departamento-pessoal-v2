import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useClipboard } from '@/hooks/useClipboard';
describe('useClipboard', () => {
  it('copia para clipboard', () => { const { result } = renderHook(() => useClipboard()); expect(result.current.copy).toBeDefined(); expect(result.current.copied).toBe(false); });
});
