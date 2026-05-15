// V22: NotificacoesService - Real implementation
import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err, toResult } from '@/types/result';

export interface NotificationPayload {
  titulo: string;
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'info' | 'alerta';
  user_id?: string;
  empresa_id?: string;
  entidade_id?: string;
  entidade_tipo?: string;
}

export async function criarNotificacao(payload: NotificationPayload): Promise<Result<void>> {
  return toResult((async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('notificacoes').insert({
      titulo: payload.titulo,
      mensagem: payload.mensagem,
      tipo: payload.tipo,
      user_id: payload.user_id || user?.id,
      empresa_id: payload.empresa_id,
      entidade_id: payload.entidade_id,
      entidade_tipo: payload.entidade_tipo,
      lida: false,
    });
    if (error) throw error;
  })());
}

export async function notificarResultadoSync(
  sucesso: boolean,
  registrosSincronizados: number,
  erros: string[]
): Promise<Result<void>> {
  return criarNotificacao({
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
): Promise<Result<void>> {
  try {
    const { data: colab } = await supabase
      .from('colaboradores')
      .select('id, empresa_id, email')
      .eq('id', colaboradorId)
      .maybeSingle();

    if (colab) {
      let targetUserId = null;
      if (colab.email) {
        const { data: profile } = await supabase
          .from('profiles' as any)
          .select('user_id')
          .eq('email', colab.email)
          .maybeSingle();
        targetUserId = (profile as any)?.user_id;
      }

      return criarNotificacao({
        titulo: `Ajuste de Ponto ${status === 'aprovado' ? 'Aprovado' : 'Recusado'}`,
        mensagem: status === 'aprovado' 
          ? 'Seu ajuste de ponto foi aprovado pelo gestor.' 
          : `Seu ajuste de ponto foi recusado. Motivo: ${motivo || 'Não informado'}`,
        tipo: status === 'aprovado' ? 'sucesso' : 'erro',
        user_id: targetUserId,
        empresa_id: colab.empresa_id ?? undefined
      });
    }
    return Ok(undefined);
  } catch (e: any) {
    return Err({
      type: 'SERVER_ERROR',
      severity: 'error',
      message: 'Falha ao notificar ajuste de ponto',
      timestamp: new Date()
    });
  }
}

export const notificacoesService = { 
  criarNotificacao, 
  notificarResultadoSync, 
  notificarAjustePonto 
};

export default notificacoesService;

