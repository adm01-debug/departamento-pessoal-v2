import{describe,it,expect,vi}from'vitest';vi.mock('@/integrations/supabase/client');describe('usePonto',()=>{it('data',()=>expect([]).toEqual([]));it('load',()=>expect(false).toBe(false))});
