import { feriasSchema, feriasFormSchema, statusFeriasSchema } from '../schemasFerias';

describe('schemasFerias', () => {
  describe('statusFeriasSchema', () => {
    it('should validate valid status', () => {
      expect(() => statusFeriasSchema.parse('pendente')).not.toThrow();
      expect(() => statusFeriasSchema.parse('aprovada')).not.toThrow();
      expect(() => statusFeriasSchema.parse('rejeitada')).not.toThrow();
      expect(() => statusFeriasSchema.parse('gozando')).not.toThrow();
    });

    it('should reject invalid status', () => {
      expect(() => statusFeriasSchema.parse('invalid')).toThrow();
    });
  });

  describe('feriasSchema', () => {
    const validFerias = {
      colaborador_id: '123',
      data_inicio: '2024-07-01',
      data_fim: '2024-07-30',
      dias_gozados: 30,
      status: 'pendente',
    };

    it('should validate valid ferias', () => {
      expect(() => feriasSchema.parse(validFerias)).not.toThrow();
    });

    it('should reject if data_fim before data_inicio', () => {
      expect(() => feriasSchema.parse({
        ...validFerias,
        data_inicio: '2024-07-30',
        data_fim: '2024-07-01'
      })).toThrow();
    });

    it('should reject more than 30 dias', () => {
      expect(() => feriasSchema.parse({
        ...validFerias,
        dias_gozados: 45
      })).toThrow();
    });
  });

  describe('feriasFormSchema', () => {
    it('should validate form data', () => {
      const formData = {
        colaborador_id: '123',
        data_inicio: new Date('2024-07-01'),
        data_fim: new Date('2024-07-30'),
        abono_pecuniario: false,
      };
      expect(() => feriasFormSchema.parse(formData)).not.toThrow();
    });

    it('should handle abono_pecuniario', () => {
      const formData = {
        colaborador_id: '123',
        data_inicio: new Date('2024-07-01'),
        data_fim: new Date('2024-07-20'),
        abono_pecuniario: true,
        dias_abono: 10,
      };
      expect(() => feriasFormSchema.parse(formData)).not.toThrow();
    });
  });
});
