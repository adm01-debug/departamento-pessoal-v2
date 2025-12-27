import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useStats } from '@/hooks/useStats';
describe('useStats', () => { it('retorna estatísticas', () => { const { result } = renderHook(() => useStats()); expect(result.current.stats).toBeDefined(); }); });
