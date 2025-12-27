import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNotificacoes } from '@/hooks/useNotificacoes';
vi.mock('@/services/notificacoesService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useNotificacoes', () => { it('retorna notificações', () => { const { result } = renderHook(() => useNotificacoes()); expect(result.current.notificacoes).toBeDefined(); }); });
