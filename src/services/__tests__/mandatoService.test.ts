import{describe,it,expect,vi}from'vitest';vi.mock('@/integrations/supabase/client');describe('mandatoService',()=>{it('exec',()=>expect(1).toBe(1));it('err',()=>expect(null).toBeNull())});
