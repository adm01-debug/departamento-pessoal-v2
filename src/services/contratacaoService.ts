import { supabase } from '@/integrations/supabase/client';

export const contratacaoService = {
  async gerarTemplateContrato(admissaoId: string) {
    const { data: admissao, error } = await supabase
      .from('admissoes')
      .select('*, empresa:empresas!admissoes_empresa_id_fkey(*)')
      .eq('id', admissaoId)
      .maybeSingle();

    if (error) throw error;
    if (!admissao) throw new Error('Admissão não encontrada');

    const empresa: any = admissao.empresa;

    // Template básico de contrato
    return `
      CONTRATO INDIVIDUAL DE TRABALHO
      
      EMPREGADOR: ${empresa?.razao_social || '—'}
      CNPJ: ${empresa?.cnpj || '—'}
      
      EMPREGADO: ${admissao.nome}
      CPF: ${admissao.cpf || '—'}
      
      Pelo presente instrumento particular de contrato de trabalho, as partes acima qualificadas resolvem 
      estabelecer as cláusulas que regerão a relação laboral:
      
      1. O EMPREGADO exercerá a função de ${admissao.cargo} no departamento ${admissao.departamento}.
      2. O salário proposto é de R$ ${Number(admissao.salario_proposto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
      3. A data prevista para início das atividades é ${new Date(admissao.data_prevista).toLocaleDateString('pt-BR')}.
      
      Data: ${new Date().toLocaleDateString('pt-BR')}
    `;
  },

  async enviarLinkCandidato(admissaoId: string, email: string) {
    const token = crypto.randomUUID();
    const expiracao = new Date();
    expiracao.setDate(expiracao.getDate() + 7); // 7 dias de validade

    const { data, error } = await supabase
      .from('admissao_tokens')
      .insert({
        admissao_id: admissaoId,
        token: token,
        email_candidato: email,
        data_expiracao: expiracao.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
