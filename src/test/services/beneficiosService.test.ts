import { describe, it, expect, vi } from 'vitest';
import { beneficiosService } from '@/services/beneficiosService';
vi.mock('@/lib/supabase', () => ({ supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ data: [], error: null }), insert: vi.fn().mockReturnValue({ data: {}, error: null }), update: vi.fn().mockReturnValue({ data: {}, error: null }), delete: vi.fn().mockReturnValue({ data: {}, error: null }) }) } }));
describe('beneficiosService', () => {
  it('getAll retorna lista', async () => { const result = await beneficiosService.getAll(); expect(Array.isArray(result)).toBe(true); });
  it('create adiciona benefício', async () => { const result = await beneficiosService.create({ nome: 'VT', valor: 300 }); expect(result).toBeDefined(); });
});
