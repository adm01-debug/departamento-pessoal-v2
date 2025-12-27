import { describe, it, expect, vi } from 'vitest';
import { departamentosService } from '@/services/departamentosService';
vi.mock('@/lib/supabase', () => ({ supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ data: [], error: null }), insert: vi.fn().mockReturnValue({ data: {}, error: null }), update: vi.fn().mockReturnValue({ data: {}, error: null }), delete: vi.fn().mockReturnValue({ data: {}, error: null }) }) } }));
describe('departamentosService', () => {
  it('getAll retorna lista', async () => { const result = await departamentosService.getAll(); expect(Array.isArray(result)).toBe(true); });
  it('create adiciona departamento', async () => { const result = await departamentosService.create({ nome: 'TI' }); expect(result).toBeDefined(); });
});
