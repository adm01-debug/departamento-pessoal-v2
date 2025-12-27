import { describe, it, expect, vi } from 'vitest';
import { cargosService } from '@/services/cargosService';
vi.mock('@/lib/supabase', () => ({ supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ data: [], error: null }), insert: vi.fn().mockReturnValue({ data: {}, error: null }), update: vi.fn().mockReturnValue({ data: {}, error: null }), delete: vi.fn().mockReturnValue({ data: {}, error: null }) }) } }));
describe('cargosService', () => {
  it('getAll retorna lista', async () => { const result = await cargosService.getAll(); expect(Array.isArray(result)).toBe(true); });
  it('create adiciona cargo', async () => { const result = await cargosService.create({ nome: 'Dev' }); expect(result).toBeDefined(); });
});
