// V15-105: src/services/seedService.ts
import { supabase } from '@/integrations/supabase/client';

export interface SeedOptions {
  truncate?: boolean;
  count?: number;
}

export const seedService = {
  async seedEmpresas(options: SeedOptions = {}) {
    if (options.truncate) await supabase.from('empresas').delete().neq('id', '');
    const empresas = Array.from({ length: options.count || 5 }, (_, i) => ({
      razao_social: `Empresa Teste ${i + 1} LTDA`,
      nome_fantasia: `Empresa ${i + 1}`,
      cnpj: `${String(i + 1).padStart(2, '0')}.000.000/0001-00`,
      inscricao_estadual: `${String(i + 1).padStart(9, '0')}`,
      email: `empresa${i + 1}@teste.com`,
      telefone: `(11) 9${String(i + 1).padStart(4, '0')}-0000`,
    }));
    return supabase.from('empresas').insert(empresas);
  },

  async seedColaboradores(empresaId: string, options: SeedOptions = {}) {
    if (options.truncate) await supabase.from('colaboradores').delete().eq('empresa_id', empresaId);
    const colaboradores = Array.from({ length: options.count || 10 }, (_, i) => ({
      empresa_id: empresaId,
      nome: `Colaborador Teste ${i + 1}`,
      cpf: `${String(i + 1).padStart(3, '0')}.000.000-00`,
      email: `colaborador${i + 1}@teste.com`,
      data_admissao: new Date().toISOString().split('T')[0],
      salario: 3000 + (i * 500),
      cargo: `Cargo ${i + 1}`,
    }));
    return supabase.from('colaboradores').insert(colaboradores);
  },

  async clearAll() {
    await supabase.from('folhas_pagamento').delete().neq('id', '');
    await supabase.from('ferias').delete().neq('id', '');
    await supabase.from('colaboradores').delete().neq('id', '');
    await supabase.from('empresas').delete().neq('id', '');
  }
};
