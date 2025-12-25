import { describe, it, expect, vi } from 'vitest';
import { auditoriaService } from '../auditoriaService';
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: vi.fn(() => ({ select: vi.fn().mockReturnThis(), eq: vi.fn(() => Promise.resolve({ data: [], error: null })) })) } }));
describe('auditoriaService', () => { it('should be defined', () => { expect(auditoriaService).toBeDefined(); }); });
