import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEmpresas } from './useEmpresas';
import { batidasPontoService } from '@/services/batidasPontoService';
import { faltasService } from '@/services/faltasService';
import { medidasDisciplinaresService } from '@/services/medidasDisciplinaresService';
import { episService, episEntregasService } from '@/services/episService';
import { jornadaHorariosService } from '@/services/jornadaHorariosService';
import { bancoHorasConfigService } from '@/services/bancoHorasConfigService';
import { toast } from 'sonner';

// === BATIDAS DE PONTO ===
export function useBatidasPonto(colaboradorId: string, dataInicio?: string, dataFim?: string) {
  return useQuery({
    queryKey: ['batidas-ponto', colaboradorId, dataInicio, dataFim],
    queryFn: () => batidasPontoService.listar(colaboradorId, dataInicio, dataFim),
    enabled: !!colaboradorId,
  });
}

export function useBatidasPontoDia(data: string) {
  const { empresaAtual } = useEmpresas();
  return useQuery({
    queryKey: ['batidas-ponto-dia', data, empresaAtual?.id],
    queryFn: () => batidasPontoService.listarPorData(data, empresaAtual?.id),
    enabled: !!data && !!empresaAtual?.id,
  });
}

export function useRegistrarBatida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: any) => batidasPontoService.registrar(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['batidas-ponto'] }); toast.success('Batida registrada'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// === FALTAS ===
export function useFaltas() {
  const { empresaAtual } = useEmpresas();
  return useQuery({
    queryKey: ['faltas', empresaAtual?.id],
    queryFn: () => faltasService.listar(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });
}

export function useFaltasColaborador(colaboradorId: string) {
  return useQuery({
    queryKey: ['faltas-colaborador', colaboradorId],
    queryFn: () => faltasService.buscarPorColaborador(colaboradorId),
    enabled: !!colaboradorId,
  });
}

export function useCriarFalta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: any) => faltasService.criar(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faltas'] }); toast.success('Falta registrada'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useAtualizarFalta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...d }: any) => faltasService.atualizar(id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faltas'] }); toast.success('Falta atualizada'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useExcluirFalta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => faltasService.excluir(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faltas'] }); toast.success('Falta excluída'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// === MEDIDAS DISCIPLINARES ===
export function useMedidasDisciplinares() {
  const { empresaAtual } = useEmpresas();
  return useQuery({
    queryKey: ['medidas-disciplinares', empresaAtual?.id],
    queryFn: () => medidasDisciplinaresService.listar(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });
}

export function useMedidasDisciplinaresColaborador(colaboradorId: string) {
  return useQuery({
    queryKey: ['medidas-disciplinares-colaborador', colaboradorId],
    queryFn: () => medidasDisciplinaresService.buscarPorColaborador(colaboradorId),
    enabled: !!colaboradorId,
  });
}

export function useCriarMedidaDisciplinar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: any) => medidasDisciplinaresService.criar(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['medidas-disciplinares'] }); toast.success('Medida disciplinar registrada'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useAtualizarMedidaDisciplinar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...d }: any) => medidasDisciplinaresService.atualizar(id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['medidas-disciplinares'] }); toast.success('Medida atualizada'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// === EPIs ===
export function useEpis() {
  const { empresaAtual } = useEmpresas();
  return useQuery({
    queryKey: ['epis', empresaAtual?.id],
    queryFn: () => episService.listar(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });
}

export function useCriarEpi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: any) => episService.criar(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['epis'] }); toast.success('EPI cadastrado'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useAtualizarEpi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...d }: any) => episService.atualizar(id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['epis'] }); toast.success('EPI atualizado'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useExcluirEpi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => episService.excluir(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['epis'] }); toast.success('EPI excluído'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// === ENTREGAS DE EPI ===
export function useEpisEntregas() {
  const { empresaAtual } = useEmpresas();
  return useQuery({
    queryKey: ['epis-entregas', empresaAtual?.id],
    queryFn: () => episEntregasService.listar(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });
}

export function useEpisEntregasColaborador(colaboradorId: string) {
  return useQuery({
    queryKey: ['epis-entregas-colaborador', colaboradorId],
    queryFn: () => episEntregasService.buscarPorColaborador(colaboradorId),
    enabled: !!colaboradorId,
  });
}

export function useCriarEpiEntrega() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: any) => episEntregasService.criar(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['epis-entregas'] }); toast.success('Entrega de EPI registrada'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDevolverEpi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dataDevolucao }: { id: string; dataDevolucao: string }) => episEntregasService.registrarDevolucao(id, dataDevolucao),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['epis-entregas'] }); toast.success('Devolução registrada'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// === JORNADAS HORÁRIOS ===
export function useJornadaHorarios(jornadaId: string) {
  return useQuery({
    queryKey: ['jornada-horarios', jornadaId],
    queryFn: () => jornadaHorariosService.listar(jornadaId),
    enabled: !!jornadaId,
  });
}

export function useSalvarGradeHorarios() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jornadaId, horarios }: { jornadaId: string; horarios: any[] }) => jornadaHorariosService.salvarGrade(jornadaId, horarios),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['jornada-horarios'] }); toast.success('Grade horária salva'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// === BANCO DE HORAS CONFIG ===
export function useBancoHorasConfig() {
  const { empresaAtual } = useEmpresas();
  return useQuery({
    queryKey: ['banco-horas-config', empresaAtual?.id],
    queryFn: () => bancoHorasConfigService.buscar(empresaAtual!.id),
    enabled: !!empresaAtual?.id,
  });
}

export function useSalvarBancoHorasConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: any) => bancoHorasConfigService.salvar(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['banco-horas-config'] }); toast.success('Configuração salva'); },
    onError: (e: any) => toast.error(e.message),
  });
}
