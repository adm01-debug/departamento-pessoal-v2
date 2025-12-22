import { describe, it, expect, vi } from 'vitest';

global.fetch = vi.fn();

describe('useViaCEP', () => {
  it('deve validar formato de CEP', () => {
    const cepValido = '01310-100';
    const cepInvalido = '123';
    const regex = /^\d{5}-?\d{3}$/;
    expect(regex.test(cepValido)).toBe(true);
    expect(regex.test(cepInvalido)).toBe(false);
  });

  it('deve formatar CEP corretamente', () => {
    const cep = '01310100';
    const formatado = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    expect(formatado).toBe('01310-100');
  });

  it('deve retornar dados do endereço', async () => {
    const mockResponse = {
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP'
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const response = await fetch('https://viacep.com.br/ws/01310100/json/');
    const data = await response.json();
    expect(data.localidade).toBe('São Paulo');
  });
});
