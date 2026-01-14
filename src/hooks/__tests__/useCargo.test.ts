import{describe,it,expect,vi}from'vitest';vi.mock('@/integrations/supabase/client');describe('useCargo',()=>{it('data',()=>expect([]).toEqual([]));it('load',()=>expect(false).toBe(false))});
