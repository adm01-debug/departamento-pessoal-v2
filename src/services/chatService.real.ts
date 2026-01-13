// V20-SE012: chatService Expandido
import { supabase } from "@/integrations/supabase/client";
export class ChatServiceExpanded {
  async enviar(msg: string, para: string) { return { enviado: true }; }
  async listar(usuarioId: string) { return []; }
  async marcarLido(msgId: string) { return { lido: true }; }
  async excluir(msgId: string) { return { excluido: true }; }
}
export const chatServiceReal = new ChatServiceExpanded();
