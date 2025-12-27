import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useVirtualList } from '@/hooks/useVirtualList';
describe('useVirtualList', () => { it('virtualiza lista', () => { const { result } = renderHook(() => useVirtualList({ items: [], itemHeight: 50 })); expect(result.current.visibleItems).toBeDefined(); }); });
