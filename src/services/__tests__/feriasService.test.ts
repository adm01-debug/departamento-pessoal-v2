/**
 * @fileoverview Testes para feriasService
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { feriasService } from '../feriasService';

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

describe('feriasService', () => {
  it('should be defined', () => {
    expect(feriasService).toBeDefined();
  });

  it('should have list method', () => {
    expect(typeof feriasService.list).toBe('function');
  });
});
