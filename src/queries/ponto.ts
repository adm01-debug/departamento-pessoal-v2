// V15-302
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pontoService } from '@/services';
import type { TipoRegistro } from '@/types';
export const usePontoColaborador = (colaboradorId: string, dataInicio: string, dataFim: string) => useQuery({ queryKey: ['ponto', colaboradorId, dataInicio, dataFim], queryFn: () => pontoService.listByColaborador(colaboradorId, dataInicio, dataFim), enabled: !!colaboradorId });
export const useEspelhoPonto = (colaboradorId: string, competencia: string) => useQuery({ queryKey: ['espelho-ponto', colaboradorId, competencia], queryFn: () => pontoService.getEspelho(colaboradorId, competencia), enabled: !!colaboradorId && !!competencia });
export const useRegistrarPonto = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ colaboradorId, tipo, coords }: { colaboradorId: string; tipo: TipoRegistro; coords?: { lat: number; lng: number } }) => pontoService.registrar(colaboradorId, tipo, coords), onSuccess: () => qc.invalidateQueries({ queryKey: ['ponto'] }) }); };
