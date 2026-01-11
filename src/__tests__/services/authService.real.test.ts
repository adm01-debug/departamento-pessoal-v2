// V16-021: Tests for AuthService
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authServiceReal } from '@/services/authService.real';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('authServiceReal', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('signIn', () => {
    it('should return user on successful login', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ data: { user: { id: '1', email: 'test@test.com' } as any, session: {} as any }, error: null });
      vi.mocked(supabase.from).mockReturnValue({ insert: vi.fn().mockResolvedValue({ error: null }) } as any);
      const result = await authServiceReal.signIn('test@test.com', 'password');
      expect(result.user).toBeTruthy();
    });

    it('should return error on invalid credentials', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ data: { user: null, session: null }, error: { message: 'Invalid login credentials' } as any });
      const result = await authServiceReal.signIn('test@test.com', 'wrong');
      expect(result.error).toBe('Email ou senha incorretos');
    });
  });

  describe('signOut', () => {
    it('should sign out user', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: { id: '1' } as any }, error: null });
      vi.mocked(supabase.from).mockReturnValue({ insert: vi.fn().mockResolvedValue({ error: null }) } as any);
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });
      await expect(authServiceReal.signOut()).resolves.not.toThrow();
    });
  });

  describe('hasRole', () => {
    it('should return true if user has role', () => {
      const user = { user_metadata: { role: 'admin' } } as any;
      expect(authServiceReal.hasRole(user, ['admin'])).toBe(true);
    });

    it('should return false if user does not have role', () => {
      const user = { user_metadata: { role: 'colaborador' } } as any;
      expect(authServiceReal.hasRole(user, ['admin'])).toBe(false);
    });
  });
});
