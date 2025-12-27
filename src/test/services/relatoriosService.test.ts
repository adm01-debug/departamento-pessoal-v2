import { describe, it, expect, vi } from 'vitest';
import { relatoriosService } from '@/services/relatoriosService';
vi.mock('@/lib/supabase', () => ({ supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ data: [], error: null }), insert: vi.fn().mockReturnValue({ data: {}, error: null }) }) } }));
describe('relatoriosService', () => {
  it('getAll retorna lista', async () => { const result = await relatoriosService.getAll(); expect(Array.isArray(result)).toBe(true); });
  it('generate gera relatório', async () => { const result = await relatoriosService.generate({ tipo: 'folha', periodo: '01/2025' }); expect(result).toBeDefined(); });
});
