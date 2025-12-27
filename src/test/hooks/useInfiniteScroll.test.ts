import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
describe('useInfiniteScroll', () => { it('gerencia scroll', () => { const { result } = renderHook(() => useInfiniteScroll({ fetchMore: async () => {} })); expect(result.current.loadMore).toBeDefined(); }); });
