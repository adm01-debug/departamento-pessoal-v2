import { describe, it, expect, vi } from 'vitest';
import { feriadosService } from '@/services/feriadosService';
vi.mock('@/lib/supabase', () => ({ supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ data: [], error: null }), insert: vi.fn().mockReturnValue({ data: {}, error: null }), update: vi.fn().mockReturnValue({ data: {}, error: null }), delete: vi.fn().mockReturnValue({ data: {}, error: null }) }) } }));
describe('feriadosService', () => {
  it('getAll retorna lista', async () => { const result = await feriadosService.getAll(); expect(Array.isArray(result)).toBe(true); });
  it('getByYear filtra por ano', async () => { const result = await feriadosService.getByYear(2025); expect(Array.isArray(result)).toBe(true); });
});
