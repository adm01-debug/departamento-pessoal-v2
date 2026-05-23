import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleSupabaseError, AppError } from './error-handler';

describe('Error Handler Service', () => {
  it('should categorize network errors correctly', () => {
    const networkError = new Error('Failed to fetch');
    const result = handleSupabaseError(networkError);
    expect(result.code).toBe('NETWORK_ERROR');
    expect(result.message).toContain('Conexão');
  });

  it('should handle Supabase specific error codes (RLS/Auth)', () => {
    const rlsError = { code: '42501', message: 'permission denied' };
    const result = handleSupabaseError(rlsError);
    expect(result.code).toBe('PERMISSION_DENIED');
  });

  it('should wrap unknown errors in AppError structure', () => {
    const unknown = 'Something went wrong';
    const result = handleSupabaseError(unknown);
    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe('UNKNOWN_ERROR');
  });
});
