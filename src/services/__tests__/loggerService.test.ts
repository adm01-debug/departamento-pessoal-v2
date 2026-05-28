import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loggerService } from '../loggerService';
import { supabase } from '@/integrations/supabase/client';

// Criar mocks globais
const mockInsert = vi.fn(() => Promise.resolve({ error: null }));
const mockFrom = vi.fn((_table: string) => ({
  insert: mockInsert,
}));

vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } })),
      },
      from: (table: string) => mockFrom(table),
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
    
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('should flush info logs after 50 logs', async () => {
    for (let i = 0; i < 50; i++) {
      await loggerService.info(`Log ${i}`);
    }
    
    // Aguardar o flush async
    await vi.waitFor(() => expect(mockFrom).toHaveBeenCalledWith('logs_sistema'));
  });

  it('should flush error logs immediately', async () => {
    await loggerService.error('Test error');
    
    // Aguardar o flush async
    await vi.waitFor(() => expect(mockFrom).toHaveBeenCalledWith('logs_sistema'));
  });
});
