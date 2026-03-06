// V22: NotificacoesService - Real implementation
import { supabase } from '@/integrations/supabase/client';

export async function notificarResultadoSync(
  sucesso: boolean,
  registrosSincronizados: number,
  erros: string[]
): Promise<void> {
  try {
    await supabase.from('notificacoes').insert({
      titulo: sucesso ? 'Sincronização concluída' : 'Erro na sincronização',
      mensagem: sucesso
        ? `${registrosSincronizados} registros sincronizados com sucesso.`
        : `Erros na sincronização: ${erros.join(', ')}`,
      tipo: sucesso ? 'sucesso' : 'erro',
      lida: false,
    });
  } catch (error) {
    console.error('[NotificacoesService] Erro ao notificar:', error);
  }
}

export default { notificarResultadoSync };
