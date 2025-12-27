import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
describe('useKeyboardNavigation', () => { it('gerencia navegação', () => { const { result } = renderHook(() => useKeyboardNavigation({ items: ['a', 'b'] })); expect(result.current.activeIndex).toBeDefined(); }); });
