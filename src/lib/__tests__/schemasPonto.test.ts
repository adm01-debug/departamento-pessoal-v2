import { pontoSchema, pontoFormSchema, registroPontoSchema } from '../schemasPonto';

describe('schemasPonto', () => {
  describe('registroPontoSchema', () => {
    const validRegistro = {
      colaborador_id: '123',
      data: '2024-01-15',
      entrada: '08:00',
      saida_almoco: '12:00',
      retorno_almoco: '13:00',
      saida: '17:00',
    };

    it('should validate valid registro', () => {
      expect(() => registroPontoSchema.parse(validRegistro)).not.toThrow();
    });

    it('should accept partial registro', () => {
      const partial = {
        colaborador_id: '123',
        data: '2024-01-15',
        entrada: '08:00',
      };
      expect(() => registroPontoSchema.parse(partial)).not.toThrow();
    });

    it('should validate time format', () => {
      expect(() => registroPontoSchema.parse({
        ...validRegistro,
        entrada: 'invalid'
      })).toThrow();
    });
  });

  describe('pontoSchema', () => {
    const validPonto = {
      colaborador_id: '123',
      mes: 1,
      ano: 2024,
      registros: [],
    };

    it('should validate valid ponto', () => {
      expect(() => pontoSchema.parse(validPonto)).not.toThrow();
    });

    it('should reject invalid month', () => {
      expect(() => pontoSchema.parse({
        ...validPonto,
        mes: 13
      })).toThrow();
    });

    it('should reject invalid year', () => {
      expect(() => pontoSchema.parse({
        ...validPonto,
        ano: 1899
      })).toThrow();
    });
  });

  describe('pontoFormSchema', () => {
    it('should validate form data', () => {
      const formData = {
        colaborador_id: '123',
        data: new Date('2024-01-15'),
        entrada: '08:00',
      };
      expect(() => pontoFormSchema.parse(formData)).not.toThrow();
    });
  });
});
