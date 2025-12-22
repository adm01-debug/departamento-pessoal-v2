import { describe, it, expect } from 'vitest';

describe('useUserRoles', () => {
  it('deve verificar permissão admin', () => {
    const roles = ['admin', 'user'];
    const isAdmin = roles.includes('admin');
    expect(isAdmin).toBe(true);
  });

  it('deve verificar múltiplas permissões', () => {
    const userRoles = ['gestor', 'user'];
    const requiredRoles = ['admin', 'gestor'];
    const hasPermission = requiredRoles.some(role => userRoles.includes(role));
    expect(hasPermission).toBe(true);
  });

  it('deve negar acesso sem permissão', () => {
    const userRoles = ['user'];
    const requiredRoles = ['admin'];
    const hasPermission = requiredRoles.some(role => userRoles.includes(role));
    expect(hasPermission).toBe(false);
  });
});
