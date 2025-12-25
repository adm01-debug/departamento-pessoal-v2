import { describe, it, expect, vi } from 'vitest';
import { pontoService } from '../pontoService';
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: vi.fn(() => ({ select: vi.fn().mockReturnThis(), eq: vi.fn(() => Promise.resolve({ data: [], error: null })) })) } }));
describe('pontoService', () => { it('should be defined', () => { expect(pontoService).toBeDefined(); }); });
