import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useOptimisticUpdate } from '@/hooks/useOptimisticUpdate';
describe('useOptimisticUpdate', () => { it('atualiza otimisticamente', () => { const { result } = renderHook(() => useOptimisticUpdate([])); expect(result.current.data).toBeDefined(); }); });
