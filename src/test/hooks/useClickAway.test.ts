import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useClickAway } from '@/hooks/useClickAway';
describe('useClickAway', () => {
  it('detecta click fora', () => { const callback = vi.fn(); const ref = { current: document.createElement('div') }; renderHook(() => useClickAway(ref, callback)); });
});
