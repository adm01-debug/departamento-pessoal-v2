import { describe, it, expect, vi } from 'vitest';
import { empresasService } from '@/services/empresasService';
vi.mock('@/lib/supabase', () => ({ supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ data: [], error: null }), insert: vi.fn().mockReturnValue({ data: {}, error: null }), update: vi.fn().mockReturnValue({ data: {}, error: null }), delete: vi.fn().mockReturnValue({ data: {}, error: null }) }) } }));
describe('empresasService', () => {
  it('getAll retorna lista', async () => { const result = await empresasService.getAll(); expect(Array.isArray(result)).toBe(true); });
  it('create adiciona empresa', async () => { const result = await empresasService.create({ nome: 'Empresa X', cnpj: '12345678901234' }); expect(result).toBeDefined(); });
});
