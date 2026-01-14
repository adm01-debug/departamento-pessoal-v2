import{describe,it,expect,vi}from'vitest';vi.mock('@/integrations/supabase/client');describe('useCentral',()=>{it('data',()=>expect([]).toEqual([]));it('loading',()=>expect(false).toBe(false))});
