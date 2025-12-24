import { empresaSchema, empresaFormSchema } from '../schemasEmpresa';

describe('schemasEmpresa', () => {
  describe('empresaSchema', () => {
    const validEmpresa = {
      razao_social: 'Empresa Teste LTDA',
      nome_fantasia: 'Empresa Teste',
      cnpj: '12345678000190',
      inscricao_estadual: '123456789',
      endereco: 'Rua Teste, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234567',
      telefone: '11999999999',
      email: 'contato@empresa.com',
    };

    it('should validate valid empresa', () => {
      expect(() => empresaSchema.parse(validEmpresa)).not.toThrow();
    });

    it('should reject invalid CNPJ format', () => {
      expect(() => empresaSchema.parse({
        ...validEmpresa,
        cnpj: '123'
      })).toThrow();
    });

    it('should reject invalid email', () => {
      expect(() => empresaSchema.parse({
        ...validEmpresa,
        email: 'invalid-email'
      })).toThrow();
    });

    it('should reject invalid CEP', () => {
      expect(() => empresaSchema.parse({
        ...validEmpresa,
        cep: '123'
      })).toThrow();
    });

    it('should validate state abbreviation', () => {
      expect(() => empresaSchema.parse({
        ...validEmpresa,
        estado: 'XX'
      })).toThrow();
    });
  });

  describe('empresaFormSchema', () => {
    it('should validate form data', () => {
      const formData = {
        razao_social: 'Empresa Teste LTDA',
        nome_fantasia: 'Empresa Teste',
        cnpj: '12.345.678/0001-90',
        email: 'contato@empresa.com',
      };
      expect(() => empresaFormSchema.parse(formData)).not.toThrow();
    });
  });
});
