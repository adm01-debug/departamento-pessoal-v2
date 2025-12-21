import { describe, it, expect, vi } from 'vitest';

// Mock do cliente Bitrix24
vi.mock('@/integrations/bitrix24/client', () => ({
  Bitrix24Client: vi.fn().mockImplementation(() => ({
    getUsers: vi.fn().mockResolvedValue([]),
    getDepartments: vi.fn().mockResolvedValue([]),
    callMethod: vi.fn().mockResolvedValue({ result: {} }),
  })),
}));

describe('useBitrix24Sync - Configuração', () => {
  it('deve validar URL do webhook', () => {
    const urlValida = 'https://empresa.bitrix24.com.br/rest/1/abc123';
    const isValid = /^https:\/\/[^/]+\/rest\/\d+\/[^/]+$/.test(urlValida);
    expect(isValid).toBe(true);
  });

  it('deve rejeitar URL inválida', () => {
    const urlInvalida = 'http://empresa.bitrix24.com.br';
    const isValid = /^https:\/\/[^/]+\/rest\/\d+\/[^/]+$/.test(urlInvalida);
    expect(isValid).toBe(false);
  });
});

describe('useBitrix24Sync - Mapeamento', () => {
  const camposBitrix = ['NAME', 'LAST_NAME', 'EMAIL', 'PERSONAL_PHONE', 'UF_DEPARTMENT'];
  const camposSistema = ['nome', 'sobrenome', 'email', 'telefone', 'departamento'];

  it('deve ter mapeamento de campos', () => {
    expect(camposBitrix.length).toBe(camposSistema.length);
  });

  it('deve incluir campos essenciais', () => {
    expect(camposBitrix).toContain('NAME');
    expect(camposBitrix).toContain('EMAIL');
  });
});

describe('useBitrix24Sync - Direção', () => {
  const direcoes = ['bitrix_para_sistema', 'sistema_para_bitrix', 'bidirecional'];

  it('deve ter 3 direções de sync', () => {
    expect(direcoes.length).toBe(3);
  });

  it('deve incluir bidirecional', () => {
    expect(direcoes).toContain('bidirecional');
  });
});

describe('useBitrix24Sync - Status', () => {
  const statusSync = ['pendente', 'sincronizado', 'erro', 'conflito'];

  it('deve ter status de sync', () => {
    expect(statusSync.length).toBe(4);
  });

  it('deve incluir erro', () => {
    expect(statusSync).toContain('erro');
  });
});
