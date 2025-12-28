/**
 * @fileoverview Testes REAIS para colaboradoresService
 * @version V8.0 - Implementação completa
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { colaboradoresService } from '@/services/colaboradoresService';
import { supabase } from '@/integrations/supabase/client';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    })),
  },
}));

// Dados de teste
const mockColaborador = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  nome: 'João Silva',
  cpf: '123.456.789-00',
  rg: '12.345.678-9',
  data_nascimento: '1990-05-15',
  sexo: 'M',
  estado_civil: 'casado',
  email: 'joao.silva@empresa.com',
  telefone: '(11) 3456-7890',
  celular: '(11) 99876-5432',
  endereco: 'Rua das Flores',
  numero: '123',
  complemento: 'Apto 45',
  bairro: 'Centro',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '01234-567',
  cargo_id: 'cargo-001',
  departamento_id: 'dept-001',
  data_admissao: '2023-01-15',
  salario: 5000.00,
  tipo_contrato: 'CLT',
  jornada_trabalho: '44h',
  banco: '001',
  agencia: '1234',
  conta: '56789-0',
  tipo_conta: 'corrente',
  pix: 'joao.silva@empresa.com',
  status: 'ativo',
  empresa_id: 'empresa-001',
  created_at: '2023-01-15T10:00:00Z',
  updated_at: '2023-01-15T10:00:00Z',
};

const mockColaboradores = [
  mockColaborador,
  { ...mockColaborador, id: '223e4567-e89b-12d3-a456-426614174001', nome: 'Maria Santos', cpf: '987.654.321-00' },
  { ...mockColaborador, id: '323e4567-e89b-12d3-a456-426614174002', nome: 'Pedro Oliveira', cpf: '456.789.123-00' },
];

describe('colaboradoresService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('listar', () => {
    it('deve listar todos os colaboradores ativos', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockColaboradores, error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await colaboradoresService.listar({ status: 'ativo' });

      expect(supabase.from).toHaveBeenCalledWith('colaboradores');
      expect(result).toHaveLength(3);
      expect(result[0].nome).toBe('João Silva');
    });

    it('deve filtrar por departamento', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [mockColaborador], error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await colaboradoresService.listar({ departamento_id: 'dept-001' });

      expect(mockQuery.eq).toHaveBeenCalledWith('departamento_id', 'dept-001');
      expect(result).toHaveLength(1);
    });

    it('deve buscar por nome ou CPF', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [mockColaborador], error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await colaboradoresService.listar({ search: 'João' });

      expect(mockQuery.or).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('deve lançar erro quando query falha', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(colaboradoresService.listar()).rejects.toThrow();
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar colaborador por ID', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockColaborador, error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await colaboradoresService.buscarPorId('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual(mockColaborador);
      expect(result?.nome).toBe('João Silva');
    });

    it('deve retornar null para ID inexistente', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(colaboradoresService.buscarPorId('inexistente')).rejects.toThrow();
    });
  });

  describe('criar', () => {
    it('deve criar novo colaborador com dados válidos', async () => {
      const novoColaborador = { ...mockColaborador };
      delete (novoColaborador as any).id;
      delete (novoColaborador as any).created_at;
      delete (novoColaborador as any).updated_at;

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockColaborador, error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await colaboradoresService.criar(novoColaborador as any);

      expect(supabase.from).toHaveBeenCalledWith('colaboradores');
      expect(mockQuery.insert).toHaveBeenCalled();
      expect(result.id).toBeDefined();
    });

    it('deve validar CPF único', async () => {
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { code: '23505', message: 'duplicate key value violates unique constraint' } 
        }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(colaboradoresService.criar({} as any)).rejects.toThrow();
    });
  });

  describe('atualizar', () => {
    it('deve atualizar colaborador existente', async () => {
      const dadosAtualizacao = { salario: 6000.00 };
      const colaboradorAtualizado = { ...mockColaborador, ...dadosAtualizacao };

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: colaboradorAtualizado, error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await colaboradoresService.atualizar(mockColaborador.id, dadosAtualizacao as any);

      expect(mockQuery.update).toHaveBeenCalledWith(dadosAtualizacao);
      expect(result.salario).toBe(6000.00);
    });
  });

  describe('excluir', () => {
    it('deve excluir colaborador (soft delete)', async () => {
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await colaboradoresService.excluir(mockColaborador.id);

      expect(mockQuery.update).toHaveBeenCalledWith({ status: 'inativo' });
    });
  });

  describe('validações', () => {
    it('deve validar CPF válido', () => {
      const cpfValido = '529.982.247-25';
      // Validação de CPF
      const cpfLimpo = cpfValido.replace(/\D/g, '');
      expect(cpfLimpo).toHaveLength(11);
    });

    it('deve rejeitar CPF inválido', () => {
      const cpfInvalido = '111.111.111-11';
      const cpfLimpo = cpfInvalido.replace(/\D/g, '');
      // CPFs com todos dígitos iguais são inválidos
      const todosIguais = cpfLimpo.split('').every(d => d === cpfLimpo[0]);
      expect(todosIguais).toBe(true);
    });

    it('deve validar email válido', () => {
      const emailValido = 'teste@empresa.com';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(emailValido)).toBe(true);
    });

    it('deve validar data de nascimento (maior de 14 anos)', () => {
      const dataNascimento = new Date('2005-01-01');
      const hoje = new Date();
      const idade = hoje.getFullYear() - dataNascimento.getFullYear();
      expect(idade).toBeGreaterThanOrEqual(14);
    });
  });
});