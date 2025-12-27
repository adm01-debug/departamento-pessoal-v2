import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFilter } from '@/hooks/useFilter';
describe('useFilter', () => { it('filtra dados', () => { const { result } = renderHook(() => useFilter([{ id: 1 }])); expect(result.current.filteredData).toBeDefined(); }); });
