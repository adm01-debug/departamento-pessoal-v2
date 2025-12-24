import { describe, it, expect } from 'vitest';
import { queryClient } from '@/lib/queryClient';

describe('queryClient', () => {
  it('deve estar definido', () => { expect(queryClient).toBeDefined(); });
  it('deve ter método getQueryData', () => { expect(queryClient.getQueryData).toBeDefined(); });
  it('deve ter método setQueryData', () => { expect(queryClient.setQueryData).toBeDefined(); });
  it('deve ter método invalidateQueries', () => { expect(queryClient.invalidateQueries).toBeDefined(); });
  it('deve ter configurações padrão', () => { 
    const defaults = queryClient.getDefaultOptions();
    expect(defaults).toBeDefined();
  });
});
