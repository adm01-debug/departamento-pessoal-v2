import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as service from '@/services/tabelasReferenciaService';

// =============================================
// Tabelas de Referência (read-only)
// =============================================
export const useNacionalidades = () =>
  useQuery({ queryKey: ['nacionalidades'], queryFn: service.listarNacionalidades });

export const useTiposDesligamento = () =>
  useQuery({ queryKey: ['tipos-desligamento'], queryFn: service.listarTiposDesligamento });

export const useTiposAvisoPrevio = () =>
  useQuery({ queryKey: ['tipos-aviso-previo'], queryFn: service.listarTiposAvisoPrevio });

export const useTiposDeficiencia = () =>
  useQuery({ queryKey: ['tipos-deficiencia'], queryFn: service.listarTiposDeficiencia });

export const useTiposPagamento = () =>
  useQuery({ queryKey: ['tipos-pagamento'], queryFn: service.listarTiposPagamento });

export const useTiposSalario = () =>
  useQuery({ queryKey: ['tipos-salario'], queryFn: service.listarTiposSalario });

export const useRelacionamentosDependentes = () =>
  useQuery({ queryKey: ['relacionamentos-dependentes'], queryFn: service.listarRelacionamentosDependentes });

export const useGenerosDocumento = () =>
  useQuery({ queryKey: ['generos-documento'], queryFn: service.listarGenerosDocumento });

export const useTiposVisto = () =>
  useQuery({ queryKey: ['tipos-visto'], queryFn: service.listarTiposVisto });

export const useCondicoesIngresso = () =>
  useQuery({ queryKey: ['condicoes-ingresso'], queryFn: service.listarCondicoesIngresso });

export const useTemposResidencia = () =>
  useQuery({ queryKey: ['tempos-residencia'], queryFn: service.listarTemposResidencia });

export const useDescricoesLogradouro = () =>
  useQuery({ queryKey: ['descricoes-logradouro'], queryFn: service.listarDescricoesLogradouro });

export const usePaises = () =>
  useQuery({ queryKey: ['paises'], queryFn: service.listarPaises });

export const useCategoriasTrabalhador = () =>
  useQuery({ queryKey: ['categorias-trabalhador'], queryFn: service.listarCategoriasTrabalhador });

export const useRelacionamentosContatoEmergencia = () =>
  useQuery({ queryKey: ['relacionamentos-contato-emergencia'], queryFn: service.listarRelacionamentosContatoEmergencia });

export const useMotivosAfastamento = () =>
  useQuery({ queryKey: ['motivos-afastamento'], queryFn: service.listarMotivosAfastamento });

// =============================================
// Centros de Custo (CRUD)
// =============================================
export function useCentrosCusto(empresaId?: string) {
  return useQuery({
    queryKey: ['centros-custo', empresaId],
    queryFn: () => service.listarCentrosCusto(empresaId),
  });
}

export function useCriarCentroCusto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: service.criarCentroCusto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['centros-custo'] }),
  });
}

export function useAtualizarCentroCusto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Record<string, unknown> }) =>
      service.atualizarCentroCusto(id, dados),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['centros-custo'] }),
  });
}

export function useExcluirCentroCusto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: service.excluirCentroCusto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['centros-custo'] }),
  });
}

// =============================================
// Contas Bancárias (CRUD)
// =============================================
export function useContasBancarias(colaboradorId: string) {
  return useQuery({
    queryKey: ['contas-bancarias', colaboradorId],
    queryFn: () => service.listarContasBancarias(colaboradorId),
    enabled: !!colaboradorId,
  });
}

export function useCriarContaBancaria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: service.criarContaBancaria,
    onSuccess: (_, vars: any) => qc.invalidateQueries({ queryKey: ['contas-bancarias', vars.colaborador_id] }),
  });
}

export function useAtualizarContaBancaria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Record<string, unknown> }) =>
      service.atualizarContaBancaria(id, dados),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-bancarias'] }),
  });
}

export function useExcluirContaBancaria(colaboradorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: service.excluirContaBancaria,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-bancarias', colaboradorId] }),
  });
}

// =============================================
// Dados de Estagiário
// =============================================
export function useDadosEstagiario(colaboradorId: string) {
  return useQuery({
    queryKey: ['dados-estagiario', colaboradorId],
    queryFn: () => service.obterDadosEstagiario(colaboradorId),
    enabled: !!colaboradorId,
  });
}

export function useSalvarDadosEstagiario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ colaboradorId, dados }: { colaboradorId: string; dados: Record<string, unknown> }) =>
      service.salvarDadosEstagiario(colaboradorId, dados),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['dados-estagiario', vars.colaboradorId] }),
  });
}

// =============================================
// Documentos Pessoais (upload tipado)
// =============================================
export function useDocumentosPessoais(colaboradorId: string) {
  return useQuery({
    queryKey: ['documentos-pessoais', colaboradorId],
    queryFn: () => service.listarDocumentosPessoais(colaboradorId),
    enabled: !!colaboradorId,
  });
}

export function useCriarDocumentoPessoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: service.criarDocumentoPessoal,
    onSuccess: (_, vars: any) => qc.invalidateQueries({ queryKey: ['documentos-pessoais', vars.colaborador_id] }),
  });
}

export function useExcluirDocumentoPessoal(colaboradorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: service.excluirDocumentoPessoal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documentos-pessoais', colaboradorId] }),
  });
}

// =============================================
// Férias - Workflow
// =============================================
export function useFeriasAprovacoes(feriasId: string) {
  return useQuery({
    queryKey: ['ferias-aprovacoes', feriasId],
    queryFn: () => service.listarFeriasAprovacoes(feriasId),
    enabled: !!feriasId,
  });
}

export function useCriarFeriasAprovacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: service.criarFeriasAprovacao,
    onSuccess: (_, vars: any) => qc.invalidateQueries({ queryKey: ['ferias-aprovacoes', vars.ferias_id] }),
  });
}

export function useAtualizarFeriasAprovacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Record<string, unknown> }) =>
      service.atualizarFeriasAprovacao(id, dados),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ferias-aprovacoes'] }),
  });
}

// =============================================
// Férias - Arquivos
// =============================================
export function useFeriasArquivos(feriasId: string) {
  return useQuery({
    queryKey: ['ferias-arquivos', feriasId],
    queryFn: () => service.listarFeriasArquivos(feriasId),
    enabled: !!feriasId,
  });
}

export function useCriarFeriasArquivo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: service.criarFeriasArquivo,
    onSuccess: (_, vars: any) => qc.invalidateQueries({ queryKey: ['ferias-arquivos', vars.ferias_id] }),
  });
}

// =============================================
// Dependentes - Benefícios
// =============================================
export function useDependentesBeneficios(dependenteId: string) {
  return useQuery({
    queryKey: ['dependentes-beneficios', dependenteId],
    queryFn: () => service.listarDependentesBeneficios(dependenteId),
    enabled: !!dependenteId,
  });
}

export function useVincularDependenteBeneficio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: service.vincularDependenteBeneficio,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dependentes-beneficios'] }),
  });
}

export function useDesvincularDependenteBeneficio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dependenteId, beneficioId }: { dependenteId: string; beneficioId: string }) =>
      service.desvincularDependenteBeneficio(dependenteId, beneficioId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dependentes-beneficios'] }),
  });
}
