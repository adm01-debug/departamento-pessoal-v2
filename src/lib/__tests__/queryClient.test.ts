import { queryClient, defaultQueryConfig } from '../queryClient';

describe('queryClient', () => {
  it('should be defined', () => {
    expect(queryClient).toBeDefined();
  });

  it('should have default options configured', () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults).toBeDefined();
  });

  it('should have staleTime configured', () => {
    expect(defaultQueryConfig.staleTime).toBeDefined();
    expect(defaultQueryConfig.staleTime).toBeGreaterThan(0);
  });

  it('should have gcTime configured', () => {
    expect(defaultQueryConfig.gcTime).toBeDefined();
    expect(defaultQueryConfig.gcTime).toBeGreaterThan(0);
  });

  it('should have retry configured', () => {
    expect(defaultQueryConfig.retry).toBeDefined();
  });

  it('should have refetchOnWindowFocus configured', () => {
    expect(defaultQueryConfig.refetchOnWindowFocus).toBeDefined();
  });

  it('should allow setting and getting query data', () => {
    const testData = { test: 'data' };
    queryClient.setQueryData(['test-key'], testData);
    const result = queryClient.getQueryData(['test-key']);
    expect(result).toEqual(testData);
  });

  it('should allow invalidating queries', async () => {
    queryClient.setQueryData(['invalidate-test'], { data: 'old' });
    await queryClient.invalidateQueries({ queryKey: ['invalidate-test'] });
    // Query should be marked as stale
    expect(queryClient.getQueryState(['invalidate-test'])?.isInvalidated).toBe(true);
  });
});
