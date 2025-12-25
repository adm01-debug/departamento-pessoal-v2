/**
 * @fileoverview Testes para relatoriosCNAB
 * @module lib/__tests__/relatoriosCNAB.test
 */
import { describe, it, expect } from 'vitest';
import { 
  formatarCNAB240Header,
  formatarCNAB240Lote,
  formatarCNAB240Detalhe,
  formatarCNAB240Trailer,
} from '../relatoriosCNAB';

describe('relatoriosCNAB', () => {
  describe('formatarCNAB240Header', () => {
    it('should format header correctly', () => {
      const header = formatarCNAB240Header({
        banco: '001',
        empresa: 'TESTE LTDA',
        cnpj: '12345678000199',
        agencia: '1234',
        conta: '123456',
      });
      
      expect(header).toBeDefined();
      expect(header.length).toBe(240);
    });

    it('should pad fields correctly', () => {
      const header = formatarCNAB240Header({
        banco: '1',
        empresa: 'A',
        cnpj: '1',
        agencia: '1',
        conta: '1',
      });
      
      expect(header.length).toBe(240);
    });
  });

  describe('formatarCNAB240Lote', () => {
    it('should format lote header', () => {
      const lote = formatarCNAB240Lote({
        sequencial: 1,
        tipoServico: '30',
        formaLancamento: '01',
      });
      
      expect(lote).toBeDefined();
      expect(lote.length).toBe(240);
    });
  });

  describe('formatarCNAB240Detalhe', () => {
    it('should format detail segment A', () => {
      const detalhe = formatarCNAB240Detalhe({
        segmento: 'A',
        sequencial: 1,
        favorecido: 'JOAO SILVA',
        cpf: '12345678901',
        valor: 1500.00,
        dataVencimento: new Date('2024-01-15'),
      });
      
      expect(detalhe).toBeDefined();
    });
  });

  describe('formatarCNAB240Trailer', () => {
    it('should format trailer correctly', () => {
      const trailer = formatarCNAB240Trailer({
        quantidadeRegistros: 10,
        valorTotal: 15000.00,
      });
      
      expect(trailer).toBeDefined();
      expect(trailer.length).toBe(240);
    });
  });
});
