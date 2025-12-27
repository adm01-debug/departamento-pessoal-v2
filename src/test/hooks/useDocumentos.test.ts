import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDocumentos } from '@/hooks/useDocumentos';
vi.mock('@/services/documentosService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useDocumentos', () => { it('retorna documentos', () => { const { result } = renderHook(() => useDocumentos()); expect(result.current.documentos).toBeDefined(); }); });
