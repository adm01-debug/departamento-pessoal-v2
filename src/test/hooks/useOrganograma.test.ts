import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useOrganograma } from '@/hooks/useOrganograma';
describe('useOrganograma', () => { it('retorna estrutura', () => { const { result } = renderHook(() => useOrganograma()); expect(result.current.data).toBeDefined(); }); });
