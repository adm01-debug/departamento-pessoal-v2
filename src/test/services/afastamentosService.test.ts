import { describe, it, expect, vi, beforeEach } from 'vitest';
import { afastamentosService } from '@/services/afastamentosService';
vi.mock('@/lib/supabase', () => ({ supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ data: [], error: null }), insert: vi.fn().mockReturnValue({ data: {}, error: null }), update: vi.fn().mockReturnValue({ data: {}, error: null }), delete: vi.fn().mockReturnValue({ data: {}, error: null }) }) } }));
describe('afastamentosService', () => {
  it('getAll retorna lista', async () => { const result = await afastamentosService.getAll(); expect(Array.isArray(result)).toBe(true); });
  it('getById retorna item', async () => { const result = await afastamentosService.getById('1'); expect(result).toBeDefined(); });
  it('create adiciona item', async () => { const result = await afastamentosService.create({ tipo: 'Médico' }); expect(result).toBeDefined(); });
  it('update modifica item', async () => { const result = await afastamentosService.update('1', { tipo: 'Férias' }); expect(result).toBeDefined(); });
  it('delete remove item', async () => { await afastamentosService.delete('1'); });
});
