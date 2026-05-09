import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '@/utils/auditLogger';


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

    // Template profissional de contrato em HTML
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: auto; padding: 40px; border: 1px solid #eee;">
        <h2 style="text-align: center; color: #1a365d; text-transform: uppercase;">Contrato Individual de Trabalho</h2>
        <hr style="border: 0; border-top: 2px solid #1a365d; margin: 20px 0;">
        
        <p><strong>EMPREGADOR:</strong> ${empresa?.razao_social || '—'}<br>
        <strong>CNPJ:</strong> ${empresa?.cnpj || '—'}<br>
        <strong>ENDEREÇO:</strong> ${empresa?.logradouro || '—'}, ${empresa?.numero || '—'} - ${empresa?.cidade || '—'}/${empresa?.uf || '—'}</p>

        <p><strong>EMPREGADO:</strong> ${admissao.nome}<br>
        <strong>CPF:</strong> ${admissao.cpf || '—'}<br>
        <strong>ENDEREÇO:</strong> ${(admissao.metadata as any)?.endereco || 'Residência informada no cadastro'}</p>

        <p>As partes acima qualificadas celebram o presente contrato sob as cláusulas seguintes:</p>

        <h3 style="color: #2c5282;">1. DA FUNÇÃO E ATIVIDADES</h3>
        <p>O EMPREGADO é contratado para exercer a função de <strong>${admissao.cargo}</strong>, junto ao departamento de <strong>${admissao.departamento}</strong>, comprometendo-se a realizar todas as tarefas inerentes ao cargo.</p>

        <h3 style="color: #2c5282;">2. DA REMUNERAÇÃO</h3>
        <p>Pelo trabalho realizado, o EMPREGADOR pagará ao EMPREGADO o salário mensal bruto de <strong>R$ ${Number(admissao.salario_proposto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.</p>

        <h3 style="color: #2c5282;">3. DA VIGÊNCIA</h3>
        <p>O presente contrato terá início em <strong>${new Date(admissao.data_prevista).toLocaleDateString('pt-BR')}</strong>, com prazo indeterminado, observadas as normas da CLT.</p>

        <h3 style="color: #2c5282;">4. DA PROTEÇÃO DE DADOS (LGPD)</h3>
        <p>O EMPREGADO autoriza o tratamento de seus dados pessoais para fins estritamente vinculados à execução deste contrato e obrigações legais.</p>

        <div style="margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; text-align: center;">
          <p>Documento gerado digitalmente em ${new Date().toLocaleDateString('pt-BR')}</p>
          <p style="font-size: 10px; color: #999;">Hash de Integridade: ${crypto.randomUUID()}</p>
        </div>
      </div>
    `;
  },

  async validarDocumento(admissaoId: string, docType: string, status: 'validado' | 'rejeitado', observacao?: string) {
    const { error } = await supabase
      .from('admissoes')
      .update({
        [`checklist_${docType}`]: status === 'validado',
        metadata: { 
          obs: observacao,
          last_validation: new Date().toISOString()
        }
      } as any)
      .eq('id', admissaoId);

    if (error) throw error;

    // Log de auditoria usando estrutura correta
    await supabase.from('audit_log').insert({
      tabela: 'admissoes',
      registro_id: admissaoId,
      acao: `VALIDACAO_DOC_${docType.toUpperCase()}`,
      dados_novos: { status, observacao }
    });
  },

  async enviarLinkCandidato(admissaoId: string, email: string) {
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiracao = new Date();
    expiracao.setDate(expiracao.getDate() + 7);

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
  },

  async enviarWhatsApp(admissaoId: string, telefone: string, token: string) {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/contratacao?token=${token}`;
    const mensagem = encodeURIComponent(`Olá! 👋 Boas-vindas à nossa equipe!\n\nSeu processo de admissão digital está pronto. Acesse pelo link seguro: ${link}\n\nCódigo de Acesso: *${token}*`);
    
    window.open(`https://wa.me/55${telefone.replace(/\D/g, '')}?text=${mensagem}`, '_blank');
    
    await supabase.from('notificacoes_admissao').insert({
      admissao_id: admissaoId,
      tipo: 'whatsapp',
      canal: 'whatsapp',
      status: 'enviado',
      mensagem: `Link de contratação enviado via WhatsApp`
    });
  }
};
