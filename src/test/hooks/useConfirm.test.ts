import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useConfirm } from '@/hooks/useConfirm';
describe('useConfirm', () => { it('retorna funções', () => { const { result } = renderHook(() => useConfirm()); expect(result.current.confirm).toBeDefined(); }); });
