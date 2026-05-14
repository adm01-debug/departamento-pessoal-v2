import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loggerService } from '../loggerService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => {
  const mockInsert = vi.fn(() => Promise.resolve({ error: null }));
  const mockFrom = vi.fn(() => ({
    insert: mockInsert,
  }));
  return {
    supabase: {
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } })),
      },
      from: mockFrom,
    },
  };
});

describe('loggerService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should buffer info logs and not call supabase immediately', async () => {
    await loggerService.info('Test log 1');
    await loggerService.info('Test log 2');
    
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('should flush info logs after timeout', async () => {
    await loggerService.info('Test log 1');
    
    vi.advanceTimersByTime(11000);
    
    // O flush é async, precisamos esperar a microtask
    await Promise.resolve();
    
    expect(supabase.from).toHaveBeenCalledWith('logs_sistema');
  });

  it('should flush error logs immediately', async () => {
    await loggerService.error('Test error');
    
    // O flush é async, precisamos esperar a microtask
    await Promise.resolve();
    
    expect(supabase.from).toHaveBeenCalledWith('logs_sistema');
  });
});
