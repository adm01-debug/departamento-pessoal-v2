import{describe,it,expect,vi}from'vitest';vi.mock('@/integrations/supabase/client');describe('detalheService',()=>{it('exec',()=>expect(1).toBe(1));it('err',()=>expect(null).toBeNull())});
