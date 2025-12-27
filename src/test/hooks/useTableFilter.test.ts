import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTableFilter } from '@/hooks/useTableFilter';
describe('useTableFilter', () => { it('filtra tabela', () => { const { result } = renderHook(() => useTableFilter([{ nome: 'João' }])); expect(result.current.filteredData).toBeDefined(); act(() => { result.current.setFilter('nome', 'João'); }); }); });
