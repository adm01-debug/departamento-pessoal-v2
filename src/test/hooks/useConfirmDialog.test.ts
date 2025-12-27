import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
describe('useConfirmDialog', () => { it('gerencia dialog', () => { const { result } = renderHook(() => useConfirmDialog()); expect(result.current.isOpen).toBe(false); act(() => { result.current.open(); }); expect(result.current.isOpen).toBe(true); }); });
