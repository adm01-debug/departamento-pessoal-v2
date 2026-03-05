// @ts-nocheck
/**
 * @fileoverview Service para organograma
 * @module services/organogramaService
 */
import { supabase } from '@/integrations/supabase/client';

export interface NoOrganograma {
  id: string;
  colaboradorId?: string;
  cargoId: string;
  departamentoId: string;
  superiorId?: string;
  nivel: number;
  ordem: number;
}

export const organogramaService = {
  async buscarArvore(): Promise<NoOrganograma[]> {
    const { data, error } = await supabase.from('organograma').select(`*, colaborador:colaboradores(*), cargo:cargos(*), departamento:departamentos(*)`).order('nivel').order('ordem');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async buscarPorDepartamento(departamentoId: string): Promise<NoOrganograma[]> {
    const { data, error } = await supabase.from('organograma').select('*').eq('departamento_id', departamentoId).order('nivel').order('ordem');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async atualizar(id: string, dados: Partial<NoOrganograma>): Promise<void> {
    const { error } = await supabase.from('organograma').update(dados).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async moverNo(id: string, novoSuperiorId: string | null): Promise<void> {
    const { error } = await supabase.rpc('mover_no_organograma', { no_id: id, novo_superior_id: novoSuperiorId });
    if (error) throw new Error(error.message);
  },

  async exportarImagem(): Promise<string> {
    // Implementar exportação como imagem
    return '';
  },
};
