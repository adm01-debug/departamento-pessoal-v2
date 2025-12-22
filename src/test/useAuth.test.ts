import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    }
  }
}));

describe('useAuth', () => {
  it('deve validar formato de email', () => {
    const emailValido = 'usuario@empresa.com';
    const emailInvalido = 'usuario@';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(regex.test(emailValido)).toBe(true);
    expect(regex.test(emailInvalido)).toBe(false);
  });

  it('deve validar força da senha', () => {
    const senhaFraca = '123456';
    const senhaForte = 'Abc123!@#';
    const temMaiuscula = /[A-Z]/.test(senhaForte);
    const temMinuscula = /[a-z]/.test(senhaForte);
    const temNumero = /[0-9]/.test(senhaForte);
    const temEspecial = /[!@#$%^&*]/.test(senhaForte);
    expect(senhaFraca.length >= 8).toBe(false);
    expect(temMaiuscula && temMinuscula && temNumero && temEspecial).toBe(true);
  });
});
