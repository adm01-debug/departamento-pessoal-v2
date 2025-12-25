/**
 * @fileoverview Testes para folhaService
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { folhaService } from '../folhaService';

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

describe('folhaService', () => {
  it('should be defined', () => {
    expect(folhaService).toBeDefined();
  });

  it('should have list method', () => {
    expect(typeof folhaService.list).toBe('function');
  });
});
