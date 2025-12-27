import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useUsuarios } from '@/hooks/useUsuarios';
vi.mock('@/services/usuariosService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useUsuarios', () => { it('retorna usuários', () => { const { result } = renderHook(() => useUsuarios()); expect(result.current.usuarios).toBeDefined(); }); });
