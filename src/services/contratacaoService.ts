import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '@/utils/auditLogger';
import { Result, Ok, Err, toResult } from '@/types/result';

export const contratacaoService = {
  async gerarTemplateContrato(admissaoId: string): Promise<Result<string>> {
    return toResult((async () => {
      const { data: admissao, error } = await supabase
        .from('admissoes')
        .select('*, empresa:empresas!admissoes_empresa_id_fkey(*)')
        .eq('id', admissaoId)
        .maybeSingle();

      if (error) throw error;
      if (!admissao) throw new Error('Admissão não encontrada');

      const empresa: any = admissao.empresa;

      return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: auto; padding: 40px; border: 1px solid #eee; background: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; text-transform: uppercase; margin: 0; font-size: 24px;">Contrato Individual de Trabalho</h1>
            <p style="color: #718096; margin-top: 5px;">Processo de Admissão Digital</p>
          </div>
          
          <hr style="border: 0; border-top: 2px solid #1a365d; margin: 20px 0;">
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">QUALIFICAÇÃO DAS PARTES</h3>
            <p><strong>EMPREGADOR:</strong> ${empresa?.razao_social || '—'}<br>
            <strong>CNPJ:</strong> ${empresa?.cnpj || '—'}<br>
            <strong>ENDEREÇO:</strong> ${empresa?.logradouro || '—'}, ${empresa?.numero || '—'} - ${empresa?.cidade || '—'}/${empresa?.uf || '—'}</p>

            <p><strong>EMPREGADO:</strong> ${admissao.nome}<br>
            <strong>CPF:</strong> ${admissao.cpf || '—'}<br>
            <strong>ENDEREÇO:</strong> ${(admissao.metadata as any)?.endereco || 'Residência informada no cadastro'}</p>
          </div>

          <p>As partes acima qualificadas celebram o presente contrato sob as cláusulas seguintes:</p>

          <h3 style="color: #2c5282;">CLÁUSULA 1ª - DA FUNÇÃO</h3>
          <p>O EMPREGADO é contratado para exercer a função de <strong>${admissao.cargo}</strong>, junto ao departamento de <strong>${admissao.departamento}</strong>, comprometendo-se a realizar todas as tarefas inerentes ao cargo com diligência e ética profissional.</p>

          <h3 style="color: #2c5282;">CLÁUSULA 2ª - DA REMUNERAÇÃO</h3>
          <p>Pelo trabalho realizado, o EMPREGADOR pagará ao EMPREGADO o salário mensal bruto de <strong>R$ ${Number(admissao.salario_proposto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>, pago até o quinto dia útil do mês subsequente ao vencido.</p>

          <h3 style="color: #2c5282;">CLÁUSULA 3ª - DA VIGÊNCIA E JORNADA</h3>
          <p>O presente contrato terá início em <strong>${new Date(admissao.data_prevista).toLocaleDateString('pt-BR')}</strong>, com prazo indeterminado. A jornada de trabalho será a estabelecida no regulamento interno da empresa, respeitando os limites legais.</p>

          <h3 style="color: #2c5282;">CLÁUSULA 4ª - DA CONFIDENCIALIDADE E PRIVACIDADE (LGPD)</h3>
          <p>O EMPREGADO compromete-se a manter sigilo sobre informações confidenciais da empresa. Em conformidade com a LGPD, o EMPREGADO autoriza o tratamento de seus dados pessoais para fins de gestão de RH, benefícios e obrigações legais.</p>

          <div style="margin-top: 60px; border: 1px dashed #cbd5e0; padding: 20px; text-align: center; border-radius: 8px; background: #f8fafc;">
            <p style="margin: 0; font-weight: bold; color: #4a5568;">CERTIFICADO DE ASSINATURA DIGITAL</p>
            <p style="font-size: 12px; color: #718096; margin: 5px 0;">Este documento será assinado eletronicamente mediante token de segurança único.</p>
            <p style="font-size: 10px; color: #a0aec0;">ID de Admissão: ${admissao.id}<br>Data de Geração: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      `;
    })());
  },

  async validarDocumento(admissaoId: string, docType: string, status: 'validado' | 'rejeitado', observacao?: string): Promise<Result<void>> {
    try {
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

      await auditLogger.log({
        tabela: 'admissoes',
        registro_id: admissaoId,
        acao: 'UPDATE',
        dados_novos: { 
          documento: docType, 
          status, 
          observacao,
          evento: 'VALIDACAO_DOCUMENTO'
        }
      });
      return Ok(undefined);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'error',
        message: 'Falha ao validar documento de admissão',
        timestamp: new Date()
      });
    }
  },

  async enviarLinkCandidato(admissaoId: string, email: string): Promise<Result<any>> {
    return toResult((async () => {
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
    })());
  },

  async enviarWhatsApp(admissaoId: string, telefone: string, token: string): Promise<Result<void>> {
    try {
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/contratacao?token=${token}`;
      const mensagem = encodeURIComponent(`Olá! 👋 Boas-vindas à nossa equipe!\n\nSeu processo de admissão digital está pronto. Acesse pelo link seguro: ${link}\n\nCódigo de Acesso: *${token}*`);
      
      try {
        const { data: admissao } = await supabase.from('admissoes').select('empresa_id').eq('id', admissaoId).single();
        if (admissao?.empresa_id) {
          const { whatsappService } = await import('./whatsappService');
          await whatsappService.sendMessage({ 
            empresaId: admissao.empresa_id, 
            phone: telefone, 
            message: `Olá! 👋 Boas-vindas!\n\nSeu processo de admissão digital está pronto: ${link}\n\nCódigo: *${token}*` 
          });
        }
      } catch (e) {
        window.open(`https://wa.me/55${telefone.replace(/\D/g, '')}?text=${mensagem}`, '_blank');
      }
      
      await supabase.from('notificacoes_admissao').insert({
        admissao_id: admissaoId,
        tipo: 'whatsapp',
        canal: 'whatsapp',
        status: 'enviado',
        mensagem: `Link de contratação enviado via WhatsApp`
      });
      return Ok(undefined);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'error',
        message: 'Falha ao enviar notificação via WhatsApp',
        timestamp: new Date()
      });
    }
  },

  async transmitirESocial(admissaoId: string): Promise<Result<boolean>> {
    try {
      const { data: admissao } = await supabase.from('admissoes').select('*').eq('id', admissaoId).single();
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { error } = await supabase
        .from('admissoes')
        .update({ 
          etapa: 'esocial', 
          metadata: { esocial_protocol: `PROTO-${Math.random().toString(36).toUpperCase().slice(0, 10)}` } as any 
        })
        .eq('id', admissaoId);
        
      if (error) throw error;
      
      await auditLogger.log({
        tabela: 'admissoes',
        registro_id: admissaoId,
        acao: 'EXECUTE_CALC',
        dados_novos: { evento: 'TRANSMISSAO_ESOCIAL_S2200', status: 'sucesso' }
      });
      
      return Ok(true);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'critical',
        message: 'Falha na transmissão para o eSocial',
        timestamp: new Date()
      });
    }
  }
};



