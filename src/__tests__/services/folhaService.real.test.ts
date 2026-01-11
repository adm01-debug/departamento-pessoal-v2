// V16-022: Tests for FolhaService
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { folhaServiceReal } from '@/services/folhaService.real';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('folhaServiceReal', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getAll', () => {
    it('should return folhas list', async () => {
      vi.mocked(supabase.from).mockReturnValue({ select: vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) }) } as any);
      const result = await folhaServiceReal.getAll({ empresa_id: 'emp-1' });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('create', () => {
    it('should create a folha', async () => {
      vi.mocked(supabase.from).mockReturnValue({ insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: '1', competencia: '2025-01' }, error: null }) }) }) } as any);
      const result = await folhaServiceReal.create({ empresa_id: 'emp-1', competencia: '2025-01', tipo: 'mensal' } as any);
      expect(result).toHaveProperty('id');
    });
  });

  describe('fechar', () => {
    it('should close folha', async () => {
      vi.mocked(supabase.from).mockReturnValue({ update: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: '1', status: 'fechada' }, error: null }) }) }) }) } as any);
      const result = await folhaServiceReal.fechar('1');
      expect(result.status).toBe('fechada');
    });
  });
});
