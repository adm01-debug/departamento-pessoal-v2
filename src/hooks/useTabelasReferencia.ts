import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as service from '@/services/tabelasReferenciaService';

// =============================================
// Helper for Result Pattern hooks
// =============================================
const useResultQuery = (key: any[], fn: () => Promise<any>, enabled: boolean = true) => 
  useQuery({
    queryKey: key,
    queryFn: async () => {
      return await fn();
    },
    enabled
  });

// =============================================
// Tabelas de Referência (read-only)
// =============================================
export const useNacionalidades = () => useResultQuery(['nacionalidades'], service.listarNacionalidades);
export const useTiposDesligamento = () => useResultQuery(['tipos-desligamento'], service.listarTiposDesligamento);
export const useTiposAvisoPrevio = () => useResultQuery(['tipos-aviso-previo'], service.listarTiposAvisoPrevio);
export const useTiposDeficiencia = () => useResultQuery(['tipos-deficiencia'], service.listarTiposDeficiencia);
export const useTiposPagamento = () => useResultQuery(['tipos-pagamento'], service.listarTiposPagamento);
export const useTiposSalario = () => useResultQuery(['tipos-salario'], service.listarTiposSalario);
export const useRelacionamentosDependentes = () => useResultQuery(['relacionamentos-dependentes'], service.listarRelacionamentosDependentes);
export const useGenerosDocumento = () => useResultQuery(['generos-documento'], service.listarGenerosDocumento);
export const useTiposVisto = () => useResultQuery(['tipos-visto'], service.listarTiposVisto);
export const useCondicoesIngresso = () => useResultQuery(['condicoes-ingresso'], service.listarCondicoesIngresso);
export const useTemposResidencia = () => useResultQuery(['tempos-residencia'], service.listarTemposResidencia);
export const useDescricoesLogradouro = () => useResultQuery(['descricoes-logradouro'], service.listarDescricoesLogradouro);
export const usePaises = () => useResultQuery(['paises'], service.listarPaises);
export const useCategoriasTrabalhador = () => useResultQuery(['categorias-trabalhador'], service.listarCategoriasTrabalhador);
export const useRelacionamentosContatoEmergencia = () => useResultQuery(['relacionamentos-contato-emergencia'], service.listarRelacionamentosContatoEmergencia);
export const useMotivosAfastamento = () => useResultQuery(['motivos-afastamento'], service.listarMotivosAfastamento);

// =============================================
// Centros de Custo (CRUD)
// =============================================
export function useCentrosCusto(empresaId?: string) {
  return useResultQuery(['centros-custo', empresaId], () => service.listarCentrosCusto(empresaId), !!empresaId);
}

export function useCriarCentroCusto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await service.criarCentroCusto(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['centros-custo'] }),
  });
}

export function useAtualizarCentroCusto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Record<string, unknown> }) => {
      return await service.atualizarCentroCusto(id, dados);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['centros-custo'] }),
  });
}

export function useExcluirCentroCusto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await service.excluirCentroCusto(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['centros-custo'] }),
  });
}

// =============================================
// Contas Bancárias (CRUD)
// =============================================
export function useContasBancarias(colaboradorId: string) {
  return useResultQuery(['contas-bancarias', colaboradorId], () => service.listarContasBancarias(colaboradorId), !!colaboradorId);
}

export function useCriarContaBancaria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await service.criarContaBancaria(data);
    },
    onSuccess: (_, vars: any) => qc.invalidateQueries({ queryKey: ['contas-bancarias', vars.colaborador_id] }),
  });
}

export function useAtualizarContaBancaria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Record<string, unknown> }) => {
      return await service.atualizarContaBancaria(id, dados);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-bancarias'] }),
  });
}

export function useExcluirContaBancaria(colaboradorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await service.excluirContaBancaria(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-bancarias', colaboradorId] }),
  });
}

// =============================================
// Dados de Estagiário
// =============================================
export function useDadosEstagiario(colaboradorId: string) {
  return useResultQuery(['dados-estagiario', colaboradorId], () => service.obterDadosEstagiario(colaboradorId), !!colaboradorId);
}

export function useSalvarDadosEstagiario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ colaboradorId, dados }: { colaboradorId: string; dados: Record<string, unknown> }) => {
      return await service.salvarDadosEstagiario(colaboradorId, dados);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['dados-estagiario', vars.colaboradorId] }),
  });
}

// =============================================
// Documentos Pessoais (upload tipado)
// =============================================
export function useDocumentosPessoais(colaboradorId: string) {
  return useResultQuery(['documentos-pessoais', colaboradorId], () => service.listarDocumentosPessoais(colaboradorId), !!colaboradorId);
}

export function useCriarDocumentoPessoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await service.criarDocumentoPessoal(data);
    },
    onSuccess: (_, vars: any) => qc.invalidateQueries({ queryKey: ['documentos-pessoais', vars.colaborador_id] }),
  });
}

export function useExcluirDocumentoPessoal(colaboradorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await service.excluirDocumentoPessoal(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documentos-pessoais', colaboradorId] }),
  });
}

// =============================================
// Férias - Workflow
// =============================================
export function useFeriasAprovacoes(feriasId: string) {
  return useResultQuery(['ferias-aprovacoes', feriasId], () => service.listarFeriasAprovacoes(feriasId), !!feriasId);
}

export function useCriarFeriasAprovacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await service.criarFeriasAprovacao(data);
    },
    onSuccess: (_, vars: any) => qc.invalidateQueries({ queryKey: ['ferias-aprovacoes', vars.ferias_id] }),
  });
}

export function useAtualizarFeriasAprovacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Record<string, unknown> }) => {
      return await service.atualizarFeriasAprovacao(id, dados);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ferias-aprovacoes'] }),
  });
}

// =============================================
// Férias - Arquivos
// =============================================
export function useFeriasArquivos(feriasId: string) {
  return useResultQuery(['ferias-arquivos', feriasId], () => service.listarFeriasArquivos(feriasId), !!feriasId);
}

export function useCriarFeriasArquivo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await service.criarFeriasArquivo(data);
    },
    onSuccess: (_, vars: any) => qc.invalidateQueries({ queryKey: ['ferias-arquivos', vars.ferias_id] }),
  });
}

// =============================================
// Dependentes - Benefícios
// =============================================
export function useDependentesBeneficios(dependenteId: string) {
  return useResultQuery(['dependentes-beneficios', dependenteId], () => service.listarDependentesBeneficios(dependenteId), !!dependenteId);
}

export function useVincularDependenteBeneficio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await service.vincularDependenteBeneficio(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dependentes-beneficios'] }),
  });
}

export function useDesvincularDependenteBeneficio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ dependenteId, beneficioId }: { dependenteId: string; beneficioId: string }) => {
      return await service.desvincularDependenteBeneficio(dependenteId, beneficioId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dependentes-beneficios'] }),
  });
}

