/**
 * Serviço para envio de notificações
 */

import { supabase } from '@/integrations/supabase/client';

export interface ResultadoSync {
  sucesso: boolean;
  quantidade: number;
  erros: string[];
}

/**
 * Notifica o resultado de uma sincronização
 */
export const notificarResultadoSync = async (
  sucesso: boolean,
  quantidade: number,
  erros: string[]
): Promise<void> => {
  try {
    const titulo = sucesso 
      ? 'Sincronização concluída' 
      : 'Erro na sincronização';
    
    const mensagem = sucesso
      ? `${quantidade} registro(s) sincronizado(s) com sucesso`
      : `Falha na sincronização: ${erros.join(', ')}`;

    await supabase.from('notificacoes').insert({
      titulo,
      mensagem,
      tipo: sucesso ? 'info' : 'erro',
      lida: false,
    });
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
  }
};

/**
 * Cria uma notificação genérica
 */
export const criarNotificacao = async (
  titulo: string,
  mensagem: string,
  tipo: string = 'info'
): Promise<void> => {
  try {
    await supabase.from('notificacoes').insert({
      titulo,
      mensagem,
      tipo,
      lida: false,
    });
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
  }
};
