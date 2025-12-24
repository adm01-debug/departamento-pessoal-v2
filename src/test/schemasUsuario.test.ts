import { describe, it, expect } from 'vitest';
import * as schemasUsuario from '@/lib/schemasUsuario';

describe('schemasUsuario', () => {
  it('deve estar definido', () => { expect(schemasUsuario).toBeDefined(); });
  it('deve ter schema de usuário', () => { 
    expect(schemasUsuario.usuarioSchema || schemasUsuario.UsuarioSchema).toBeDefined(); 
  });
  it('deve ter roles', () => { 
    expect(schemasUsuario.roles || schemasUsuario.ROLES).toBeDefined(); 
  });
});
