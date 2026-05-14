import { describe, it, expect, vi } from 'vitest';
import { loggerService } from '../loggerService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } })),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

describe('loggerService', () => {
  it('should buffer info logs and not call supabase immediately', async () => {
    const insertSpy = vi.spyOn(supabase.from('logs_sistema' as any), 'insert' as any);
    
    await loggerService.info('Test log 1');
    await loggerService.info('Test log 2');
    
    expect(insertSpy).not.toHaveBeenCalled();
  });

  it('should flush error logs immediately', async () => {
    const insertSpy = vi.spyOn(supabase, 'from');
    
    await loggerService.error('Test error');
    
    expect(insertSpy).toHaveBeenCalledWith('logs_sistema');
  });
});
