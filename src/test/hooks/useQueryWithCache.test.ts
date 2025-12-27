import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useQueryWithCache } from '@/hooks/useQueryWithCache';
describe('useQueryWithCache', () => { it('executa query', () => { const { result } = renderHook(() => useQueryWithCache('key', async () => [])); expect(result.current.data).toBeDefined(); }); });
