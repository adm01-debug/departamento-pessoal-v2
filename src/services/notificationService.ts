// @ts-nocheck
// V16-FIX: Notification Service - Alertas Automáticos
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id?: string;
  empresa_id: string;
  usuario_id?: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  link?: string;
  lida?: boolean;
}

export const notificationService = {
  async create(notification: Notification): Promise<void> {
    const { error } = await supabase.from('notificacoes').insert(notification);
    if (error) console.error('Erro ao criar notificação:', error);
  },

  async getUnread(usuarioId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('lida', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async markAsRead(id: string): Promise<void> {
    await supabase
      .from('notificacoes')
      .update({ lida: true, data_leitura: new Date().toISOString() })
      .eq('id', id);
  },

  async checkFeriasVencendo(empresaId: string): Promise<void> {
    const { data: ferias } = await supabase
      .from('ferias')
      .select(`
        *,
        colaborador:colaboradores(id, nome, email)
      `)
      .eq('status', 'pendente');

    const hoje = new Date();
    
    for (const f of ferias || []) {
      const vencimento = new Date(f.periodo_aquisitivo_fim);
      vencimento.setFullYear(vencimento.getFullYear() + 1);
      
      const diasRestantes = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasRestantes <= 60 && diasRestantes > 0) {
        await this.create({
          empresa_id: empresaId,
          titulo: 'Férias Vencendo',
          mensagem: `Colaborador ${f.colaborador?.nome} tem férias vencendo em ${diasRestantes} dias.`,
          tipo: diasRestantes <= 30 ? 'error' : 'warning',
          link: `/ferias/${f.id}`,
        });
      }
    }
  },

  async checkContratosVencendo(empresaId: string): Promise<void> {
    const { data: colaboradores } = await supabase
      .from('colaboradores')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('tipo_contrato', 'experiencia')
      .eq('status', 'ativo');

    const hoje = new Date();

    for (const c of colaboradores || []) {
      const admissao = new Date(c.data_admissao);
      const fimExperiencia = new Date(admissao);
      fimExperiencia.setDate(fimExperiencia.getDate() + 90);
      
      const diasRestantes = Math.ceil((fimExperiencia.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasRestantes <= 15 && diasRestantes > 0) {
        await this.create({
          empresa_id: empresaId,
          titulo: 'Contrato de Experiência Vencendo',
          mensagem: `Contrato de ${c.nome} vence em ${diasRestantes} dias. Decidir sobre efetivação.`,
          tipo: 'warning',
          link: `/colaboradores/${c.id}`,
        });
      }
    }
  },
};

export default notificationService;
