import { describe, it, expect, vi } from 'vitest';
import { notificacoesService } from '@/services/notificacoesService';
vi.mock('@/lib/supabase', () => ({ supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ data: [], error: null }), insert: vi.fn().mockReturnValue({ data: {}, error: null }), update: vi.fn().mockReturnValue({ data: {}, error: null }), delete: vi.fn().mockReturnValue({ data: {}, error: null }) }) } }));
describe('notificacoesService', () => {
  it('getAll retorna lista', async () => { const result = await notificacoesService.getAll(); expect(Array.isArray(result)).toBe(true); });
  it('markAsRead marca como lida', async () => { await notificacoesService.markAsRead('1'); });
});
