// V16-023: Tests for FeriasService
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { feriasServiceReal } from '@/services/feriasService.real';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('feriasServiceReal', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getAll', () => {
    it('should return ferias list', async () => {
      vi.mocked(supabase.from).mockReturnValue({ select: vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) }) } as any);
      const result = await feriasServiceReal.getAll({});
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('programar', () => {
    it('should program ferias', async () => {
      vi.mocked(supabase.from).mockReturnValue({ update: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: '1', status: 'programada', dias_gozo: 30 }, error: null }) }) }) }) } as any);
      const result = await feriasServiceReal.programar('1', '2025-02-01', 30);
      expect(result.status).toBe('programada');
    });
  });

  describe('concluir', () => {
    it('should complete ferias', async () => {
      vi.mocked(supabase.from).mockReturnValue({ update: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: '1', status: 'concluida' }, error: null }) }) }) }) } as any);
      const result = await feriasServiceReal.concluir('1');
      expect(result.status).toBe('concluida');
    });
  });
});
