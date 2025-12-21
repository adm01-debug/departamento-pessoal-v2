import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bitrix24Client, Bitrix24User, Bitrix24Department, bitrix24 } from '@/integrations/bitrix24/client';
import { ColaboradorDB } from '@/types/colaborador';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

// =====================================================
// TIPOS
// =====================================================

export type DirecaoSync = 'bitrix_para_sistema' | 'sistema_para_bitrix' | 'bidirecional';
export type StatusSync = 'pendente' | 'sincronizado' | 'erro' | 'conflito';

export interface ConfiguracaoSync {
  webhook_url: string;
  direcao: DirecaoSync;
  campos_sync: string[];
  sync_automatico: boolean;
  intervalo_minutos: number;
}

export interface MapeamentoColaborador {
  colaborador_id: string;
  bitrix_user_id: number;
  ultima_sync: string;
  status: StatusSync;
}

export interface ResultadoSync {
  sucesso: number;
  erros: number;
  conflitos: number;
  detalhes: string[];
}

export interface LogSync {
  id?: string;
  tipo: 'importacao' | 'exportacao' | 'sincronizacao';
  direcao: DirecaoSync;
  resultado: ResultadoSync;
  created_at?: string;
}

// =====================================================
// HOOK PRINCIPAL
// =====================================================

export function useBitrix24Sync() {
  const queryClient = useQueryClient();
  const [sincronizando, setSincronizando] = useState(false);
  const auditoria = useAuditoriaIntegration('bitrix24_sync');

  // Configuração
  const { data: configuracao, isLoading: loadingConfig } = useQuery({
    queryKey: ['bitrix24-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('chave', 'bitrix24_sync')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.valor as ConfiguracaoSync | null;
    },
  });

  const salvarConfiguracao = async (config: ConfiguracaoSync): Promise<void> => {
    try {
      const { error } = await supabase
        .from('configuracoes')
        .upsert({
          chave: 'bitrix24_sync',
          valor: config,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // ✅ AUDITORIA
      await auditoria.registrarAlteracao('config', {}, { configuracao: config });

      toast.success('Configuração salva com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['bitrix24-config'] });
    } catch (err: unknown) {
      toast.error('Erro ao salvar configuração: ' + err.message);
      throw err;
    }
  };

  // Testar conexão
  const testarConexaoMutation = useMutation({
    mutationFn: async (webhookUrl?: string) => {
      const url = webhookUrl || configuracao?.webhook_url;
      if (!url) throw new Error('URL do webhook não configurada');

      const client = new Bitrix24Client(url);
      const result = await client.testConnection();
      
      if (!result.success) {
        throw new Error(result.error || 'Falha na conexão');
      }
      
      return result;
    },
    onSuccess: () => {
      toast.success('Conexão com Bitrix24 estabelecida com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro na conexão: ' + error.message);
    },
  });

  // Buscar usuários do Bitrix
  const { data: usuariosBitrix, refetch: refetchUsuarios } = useQuery({
    queryKey: ['bitrix24-users'],
    queryFn: async () => {
      if (!configuracao?.webhook_url) return [];
      const client = new Bitrix24Client(configuracao.webhook_url);
      return await client.getUsers();
    },
    enabled: !!configuracao?.webhook_url,
  });

  // Buscar departamentos do Bitrix
  const { data: departamentosBitrix } = useQuery({
    queryKey: ['bitrix24-departments'],
    queryFn: async () => {
      if (!configuracao?.webhook_url) return [];
      const client = new Bitrix24Client(configuracao.webhook_url);
      return await client.getDepartments();
    },
    enabled: !!configuracao?.webhook_url,
  });

  // Importar do Bitrix para o sistema
  const importarDoBitrix = useCallback(async (): Promise<ResultadoSync> => {
    if (!configuracao?.webhook_url) {
      throw new Error('Webhook não configurado');
    }

    setSincronizando(true);
    const resultado: ResultadoSync = { sucesso: 0, erros: 0, conflitos: 0, detalhes: [] };

    try {
      const client = new Bitrix24Client(configuracao.webhook_url);
      const usuarios = await client.getUsers();
      
      for (const user of usuarios) {
        try {
          // Verificar se já existe por bitrix_id ou email
          const { data: existente } = await supabase
            .from('colaboradores')
            .select('id, bitrix_id')
            .or(`bitrix_id.eq.${user.ID},email.eq.${user.EMAIL}`)
            .single();

          const dadosColaborador = {
            nome_completo: `${user.NAME} ${user.LAST_NAME}`.trim(),
            email: user.EMAIL,
            telefone: user.PERSONAL_PHONE || user.WORK_PHONE,
            cargo: user.WORK_POSITION,
            departamento: user.UF_DEPARTMENT?.[0]?.toString(),
            bitrix_id: user.ID.toString(),
            bitrix_sync_status: 'sincronizado' as StatusSync,
            bitrix_ultima_sync: new Date().toISOString(),
          };

          if (existente) {
            await supabase
              .from('colaboradores')
              .update({
                ...dadosColaborador,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existente.id);
            resultado.detalhes.push(`Atualizado: ${dadosColaborador.nome_completo}`);
          } else {
            await supabase
              .from('colaboradores')
              .insert({
                ...dadosColaborador,
                cpf: '',
                data_admissao: new Date().toISOString().split('T')[0],
                status: 'ativo',
              });
            resultado.detalhes.push(`Importado: ${dadosColaborador.nome_completo}`);
          }
          resultado.sucesso++;
        } catch (err: unknown) {
          resultado.erros++;
          resultado.detalhes.push(`Erro em ${user.NAME}: ${err.message}`);
        }
      }

      // ✅ AUDITORIA
      await auditoria.registrarCriacao('import', {
        tipo: 'importacao',
        direcao: 'bitrix_para_sistema',
        resultado
      });

      await registrarLog('importacao', 'bitrix_para_sistema', resultado);
      toast.success(`Importação concluída: ${resultado.sucesso} sucesso, ${resultado.erros} erros`);
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      
      return resultado;
    } catch (err: unknown) {
      toast.error('Erro na importação: ' + err.message);
      throw err;
    } finally {
      setSincronizando(false);
    }
  }, [configuracao, queryClient, auditoria]);

  // Exportar do sistema para o Bitrix
  const exportarParaBitrix = useCallback(async (colaboradorIds?: string[]): Promise<ResultadoSync> => {
    if (!configuracao?.webhook_url) {
      throw new Error('Webhook não configurado');
    }

    setSincronizando(true);
    const resultado: ResultadoSync = { sucesso: 0, erros: 0, conflitos: 0, detalhes: [] };

    try {
      const client = new Bitrix24Client(configuracao.webhook_url);
      
      let query = supabase.from('colaboradores').select('*');
      if (colaboradorIds?.length) {
        query = query.in('id', colaboradorIds);
      }
      
      const { data: colaboradores, error } = await query;
      if (error) throw error;

      for (const colab of colaboradores || []) {
        try {
          const dadosBitrix = {
            NAME: colab.nome_completo?.split(' ')[0] || '',
            LAST_NAME: colab.nome_completo?.split(' ').slice(1).join(' ') || '',
            EMAIL: colab.email,
            PERSONAL_PHONE: colab.telefone,
            WORK_POSITION: colab.cargo,
          };

          if (colab.bitrix_id) {
            await client.updateUser(colab.bitrix_id, dadosBitrix);
            resultado.detalhes.push(`Atualizado no Bitrix: ${colab.nome_completo}`);
          } else {
            const usuarios = await client.getUsers();
            const userBitrix = usuarios.find(u => u.EMAIL === colab.email);
            
            if (userBitrix) {
              await client.updateUser(userBitrix.ID, dadosBitrix);
              await supabase
                .from('colaboradores')
                .update({
                  bitrix_id: userBitrix.ID.toString(),
                  bitrix_sync_status: 'sincronizado',
                  bitrix_ultima_sync: new Date().toISOString(),
                })
                .eq('id', colab.id);
              resultado.detalhes.push(`Vinculado e atualizado: ${colab.nome_completo}`);
            } else {
              await supabase
                .from('colaboradores')
                .update({
                  bitrix_sync_status: 'pendente',
                })
                .eq('id', colab.id);
              resultado.detalhes.push(`Não encontrado no Bitrix: ${colab.nome_completo}`);
              resultado.conflitos++;
              continue;
            }
          }
          resultado.sucesso++;
        } catch (err: unknown) {
          resultado.erros++;
          resultado.detalhes.push(`Erro em ${colab.nome_completo}: ${err.message}`);
          
          await supabase
            .from('colaboradores')
            .update({ bitrix_sync_status: 'erro' })
            .eq('id', colab.id);
        }
      }

      // ✅ AUDITORIA
      await auditoria.registrarCriacao('export', {
        tipo: 'exportacao',
        direcao: 'sistema_para_bitrix',
        resultado,
        colaboradores_ids: colaboradorIds
      });

      await registrarLog('exportacao', 'sistema_para_bitrix', resultado);
      toast.success(`Exportação concluída: ${resultado.sucesso} sucesso, ${resultado.erros} erros`);
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      
      return resultado;
    } catch (err: unknown) {
      toast.error('Erro na exportação: ' + err.message);
      throw err;
    } finally {
      setSincronizando(false);
    }
  }, [configuracao, queryClient, auditoria]);

  // Sincronização bidirecional
  const sincronizarBidirecional = useCallback(async (): Promise<ResultadoSync> => {
    setSincronizando(true);
    const resultado: ResultadoSync = { sucesso: 0, erros: 0, conflitos: 0, detalhes: [] };

    try {
      const resultImport = await importarDoBitrix();
      resultado.sucesso += resultImport.sucesso;
      resultado.erros += resultImport.erros;
      resultado.conflitos += resultImport.conflitos;
      resultado.detalhes.push(...resultImport.detalhes);

      const resultExport = await exportarParaBitrix();
      resultado.sucesso += resultExport.sucesso;
      resultado.erros += resultExport.erros;
      resultado.conflitos += resultExport.conflitos;
      resultado.detalhes.push(...resultExport.detalhes);

      // ✅ AUDITORIA
      await auditoria.registrarCriacao('sync_bidirecional', {
        tipo: 'sincronizacao',
        direcao: 'bidirecional',
        resultado
      });

      await registrarLog('sincronizacao', 'bidirecional', resultado);
      
      return resultado;
    } finally {
      setSincronizando(false);
    }
  }, [importarDoBitrix, exportarParaBitrix, auditoria]);

  // Registrar log de sync
  const registrarLog = async (tipo: LogSync['tipo'], direcao: DirecaoSync, resultado: ResultadoSync) => {
    await supabase.from('bitrix24_sync_logs').insert({
      tipo,
      direcao,
      sucesso: resultado.sucesso,
      erros: resultado.erros,
      conflitos: resultado.conflitos,
      detalhes: resultado.detalhes,
    });
  };

  // Buscar logs de sync
  const { data: logsSync } = useQuery({
    queryKey: ['bitrix24-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitrix24_sync_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  return {
    configuracao,
    loadingConfig,
    salvarConfiguracao,
    testarConexao: testarConexaoMutation.mutate,
    testandoConexao: testarConexaoMutation.isPending,
    usuariosBitrix,
    departamentosBitrix,
    refetchUsuarios,
    importarDoBitrix,
    exportarParaBitrix,
    sincronizarBidirecional,
    sincronizando,
    logsSync,
  };
}
