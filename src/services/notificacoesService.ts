// V22: NotificacoesService - Real implementation
import { supabase } from '@/integrations/supabase/client';

export interface NotificationPayload {
  titulo: string;
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'info' | 'alerta';
  user_id?: string;
  empresa_id?: string;
  entidade_id?: string;
  entidade_tipo?: string;
}

export async function criarNotificacao(payload: NotificationPayload): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('notificacoes').insert({
      titulo: payload.titulo,
      mensagem: payload.mensagem,
      tipo: payload.tipo,
      user_id: payload.user_id || user?.id,
      empresa_id: payload.empresa_id,
      entidade_id: payload.entidade_id,
      entidade_tipo: payload.entidade_tipo,
      lida: false,
    });
  } catch (error) {
    console.error('[NotificacoesService] Erro ao criar notificação:', error);
  }
}

export async function notificarResultadoSync(
  sucesso: boolean,
  registrosSincronizados: number,
  erros: string[]
): Promise<void> {
  await criarNotificacao({
    titulo: sucesso ? 'Sincronização concluída' : 'Erro na sincronização',
    mensagem: sucesso
      ? `${registrosSincronizados} registros sincronizados com sucesso.`
      : `Erros na sincronização: ${erros.join(', ')}`,
    tipo: sucesso ? 'sucesso' : 'erro',
  });
}

export async function notificarAjustePonto(
  colaboradorId: string,
  status: 'aprovado' | 'recusado',
  motivo?: string
): Promise<void> {
  // Buscar o colaborador para obter empresa_id e possivelmente o email para vínculo futuro
  const { data: colab } = await supabase
    .from('colaboradores')
    .select('id, empresa_id, email')
    .eq('id', colaboradorId)
    .maybeSingle();

  if (colab) {
    // Tentar encontrar o user_id através do email se disponível
    let targetUserId = null;
    if (colab.email) {
      const { data: profile } = await supabase
        .from('profiles' as any)
        .select('user_id')
        .eq('email', colab.email)
        .maybeSingle();
      targetUserId = (profile as any)?.user_id;
    }

    await criarNotificacao({
      titulo: `Ajuste de Ponto ${status === 'aprovado' ? 'Aprovado' : 'Recusado'}`,
      mensagem: status === 'aprovado' 
        ? 'Seu ajuste de ponto foi aprovado pelo gestor.' 
        : `Seu ajuste de ponto foi recusado. Motivo: ${motivo || 'Não informado'}`,
      tipo: status === 'aprovado' ? 'sucesso' : 'erro',
      user_id: targetUserId,
      empresa_id: colab.empresa_id ?? undefined
    });
  }
}

export default { 
  criarNotificacao, 
  notificarResultadoSync, 
  notificarAjustePonto 
};
