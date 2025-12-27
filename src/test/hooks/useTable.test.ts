import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTable } from '@/hooks/useTable';
describe('useTable', () => { it('gerencia tabela', () => { const { result } = renderHook(() => useTable({ data: [] })); expect(result.current.data).toBeDefined(); }); });
