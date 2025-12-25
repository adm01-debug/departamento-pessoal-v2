import { describe, it, expect, vi } from 'vitest';
import { esocialService } from '../esocialService';
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: vi.fn(() => ({ select: vi.fn().mockReturnThis(), eq: vi.fn(() => Promise.resolve({ data: [], error: null })) })) } }));
describe('esocialService', () => { it('should be defined', () => { expect(esocialService).toBeDefined(); }); });
