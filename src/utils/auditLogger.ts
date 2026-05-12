import { supabase } from '@/integrations/supabase/client';

export const auditLogger = {
  async log(params: {
    tabela: string;
    registro_id: string;
    acao: 'INSERT' | 'UPDATE' | 'DELETE' | 'EXECUTE_CALC' | 'SIGN';
    dados_anteriores?: any;
    dados_novos?: any;
    user_id?: string;
    user_email?: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('audit_log').insert({
        tabela: params.tabela,
        registro_id: params.registro_id,
        acao: params.acao,
        dados_anteriores: params.dados_anteriores || null,
        dados_novos: params.dados_novos || null,
        user_id: params.user_id || user?.id,
        user_email: params.user_email || user?.email,
      });
      if (error) console.error('Audit log error:', error);
    } catch (e) {
      console.error('Audit log exception:', e);
    }
  }
};
