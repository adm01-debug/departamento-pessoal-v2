import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usuariosService } from '@/services/usuariosService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ order: vi.fn(() => ({ data: [{ id: '1', email: 'user@test.com', role: 'admin' }], error: null })) })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
    auth: { admin: { createUser: vi.fn(() => ({ data: {}, error: null })), deleteUser: vi.fn(() => ({ error: null })) } },
  },
}));

describe('usuariosService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(usuariosService).toBeDefined(); });
  it('deve ter método de listar', () => { expect(usuariosService.listar || usuariosService.getAll).toBeDefined(); });
  it('deve ter método de criar', () => { expect(usuariosService.criar || usuariosService.create).toBeDefined(); });
  it('deve ter método de atualizar permissões', () => { expect(usuariosService.atualizarPermissoes || usuariosService.updatePermissions).toBeDefined(); });
});
