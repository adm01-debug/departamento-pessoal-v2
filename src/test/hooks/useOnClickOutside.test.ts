import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
describe('useOnClickOutside', () => { it('detecta click fora', () => { const ref = { current: document.createElement('div') }; const callback = vi.fn(); renderHook(() => useOnClickOutside(ref, callback)); }); });
