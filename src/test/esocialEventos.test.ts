import { describe, it, expect } from 'vitest';
import { gerarXML_S2205, gerarXML_S2206, gerarXML_S2230, MOTIVOS_AFASTAMENTO_ESOCIAL } from '../lib/esocialEventos';

describe('eSocial - Eventos', () => {
  describe('gerarXML_S2205 - Alteração de Dados Cadastrais', () => {
    it('deve gerar XML válido', () => {
      const dados = {
        cpf: '52998224725',
        nome: 'João Silva',
        dataNascimento: '1990-01-15',
        sexo: 'M',
        nacionalidade: 'BR',
        endereco: {
          logradouro: 'Rua Teste',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          uf: 'SP',
          cep: '01234567'
        }
      };
      
      const xml = gerarXML_S2205(dados);
      expect(xml).toContain('<?xml');
      expect(xml).toContain('S2205');
    });
  });

  describe('gerarXML_S2206 - Alteração Contratual', () => {
    it('deve gerar XML válido', () => {
      const dados = {
        cpf: '52998224725',
        matricula: '001234',
        dataAlteracao: '2025-01-15',
        cargo: 'Desenvolvedor Senior',
        salario: 15000.00
      };
      
      const xml = gerarXML_S2206(dados);
      expect(xml).toContain('<?xml');
      expect(xml).toContain('S2206');
    });
  });

  describe('gerarXML_S2230 - Afastamento', () => {
    it('deve gerar XML válido', () => {
      const dados = {
        cpf: '52998224725',
        matricula: '001234',
        dataInicio: '2025-01-15',
        dataFim: '2025-01-20',
        motivo: '01'
      };
      
      const xml = gerarXML_S2230(dados);
      expect(xml).toContain('<?xml');
      expect(xml).toContain('S2230');
    });
  });

  describe('MOTIVOS_AFASTAMENTO_ESOCIAL', () => {
    it('deve ter motivos mapeados', () => {
      expect(MOTIVOS_AFASTAMENTO_ESOCIAL).toBeDefined();
      expect(Object.keys(MOTIVOS_AFASTAMENTO_ESOCIAL).length).toBeGreaterThan(0);
    });
  });
});
