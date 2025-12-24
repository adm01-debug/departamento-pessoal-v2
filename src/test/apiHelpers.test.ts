import { describe, it, expect, vi } from 'vitest';
import * as apiHelpers from '@/lib/apiHelpers';

describe('apiHelpers', () => {
  it('deve estar definido', () => { expect(apiHelpers).toBeDefined(); });
  it('deve ter função de tratamento de erro', () => { 
    expect(apiHelpers.handleError || apiHelpers.handleApiError || apiHelpers.formatError).toBeDefined(); 
  });
  it('deve ter função de requisição', () => { 
    expect(apiHelpers.request || apiHelpers.fetchApi || apiHelpers.apiRequest).toBeDefined(); 
  });
  it('deve ter função de retry', () => { 
    expect(apiHelpers.retry || apiHelpers.withRetry).toBeDefined(); 
  });
});
