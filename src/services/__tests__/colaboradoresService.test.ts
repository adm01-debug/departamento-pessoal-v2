/**
 * @fileoverview Testes para colaboradoresService
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { colaboradoresService } from '../colaboradoresService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

describe('colaboradoresService', () => {
  it('should be defined', () => {
    expect(colaboradoresService).toBeDefined();
  });

  it('should have list method', () => {
    expect(typeof colaboradoresService.list).toBe('function');
  });
});
