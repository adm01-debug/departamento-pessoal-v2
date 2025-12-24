import { usuarioSchema, usuarioFormSchema, roleSchema } from '../schemasUsuario';

describe('schemasUsuario', () => {
  describe('roleSchema', () => {
    it('should validate valid roles', () => {
      expect(() => roleSchema.parse('admin')).not.toThrow();
      expect(() => roleSchema.parse('gerente')).not.toThrow();
      expect(() => roleSchema.parse('operador')).not.toThrow();
      expect(() => roleSchema.parse('visualizador')).not.toThrow();
    });

    it('should reject invalid roles', () => {
      expect(() => roleSchema.parse('invalid')).toThrow();
    });
  });

  describe('usuarioSchema', () => {
    const validUsuario = {
      nome: 'João Silva',
      email: 'joao@empresa.com',
      role: 'operador',
      ativo: true,
    };

    it('should validate valid usuario', () => {
      expect(() => usuarioSchema.parse(validUsuario)).not.toThrow();
    });

    it('should reject invalid email', () => {
      expect(() => usuarioSchema.parse({
        ...validUsuario,
        email: 'invalid'
      })).toThrow();
    });

    it('should reject empty nome', () => {
      expect(() => usuarioSchema.parse({
        ...validUsuario,
        nome: ''
      })).toThrow();
    });

    it('should require minimum nome length', () => {
      expect(() => usuarioSchema.parse({
        ...validUsuario,
        nome: 'Jo'
      })).toThrow();
    });
  });

  describe('usuarioFormSchema', () => {
    it('should validate form data', () => {
      const formData = {
        nome: 'Maria Santos',
        email: 'maria@empresa.com',
        role: 'gerente',
        senha: 'senha123',
      };
      expect(() => usuarioFormSchema.parse(formData)).not.toThrow();
    });

    it('should require password on create', () => {
      const formData = {
        nome: 'Maria Santos',
        email: 'maria@empresa.com',
        role: 'gerente',
      };
      expect(() => usuarioFormSchema.parse(formData)).toThrow();
    });
  });
});
