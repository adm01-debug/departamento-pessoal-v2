import { describe, it, expect, vi } from 'vitest';
import { usuariosService } from '@/services/usuariosService';
vi.mock('@/lib/supabase', () => ({ supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ data: [], error: null }), insert: vi.fn().mockReturnValue({ data: {}, error: null }), update: vi.fn().mockReturnValue({ data: {}, error: null }), delete: vi.fn().mockReturnValue({ data: {}, error: null }) }) } }));
describe('usuariosService', () => {
  it('getAll retorna lista', async () => { const result = await usuariosService.getAll(); expect(Array.isArray(result)).toBe(true); });
  it('create adiciona usuário', async () => { const result = await usuariosService.create({ nome: 'Admin', email: 'admin@test.com' }); expect(result).toBeDefined(); });
  it('updateRole atualiza role', async () => { await usuariosService.updateRole('1', 'admin'); });
});
