import { describe, it, expect, vi } from 'vitest';
import { documentosService } from '@/services/documentosService';
vi.mock('@/lib/supabase', () => ({ supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ data: [], error: null }), insert: vi.fn().mockReturnValue({ data: {}, error: null }), update: vi.fn().mockReturnValue({ data: {}, error: null }), delete: vi.fn().mockReturnValue({ data: {}, error: null }) }) } }));
describe('documentosService', () => {
  it('getAll retorna lista', async () => { const result = await documentosService.getAll(); expect(Array.isArray(result)).toBe(true); });
  it('upload envia documento', async () => { const result = await documentosService.upload({ file: new File([], 'test.pdf') }); expect(result).toBeDefined(); });
});
