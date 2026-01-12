// V19-HE001: useESocialConsulta Real Expandido
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { esocialServiceReal } from "@/services/esocialService.real";
import { useToast } from "@/hooks/use-toast";

export function useESocialConsultaReal(empresaId: string) {
  const [consultando, setConsultando] = useState(false);
  const { toast } = useToast();

  const { data: eventos, refetch } = useQuery({
    queryKey: ["esocial-eventos", empresaId],
    queryFn: () => esocialServiceReal.getEventos(empresaId),
    enabled: !!empresaId
  });

  const consultarEvento = useCallback(async (eventoId: string) => {
    setConsultando(true);
    try {
      const resultado = await esocialServiceReal.consultarRetorno(eventoId);
      toast({ title: `Status: ${resultado.status}` });
      return resultado;
    } catch (error) {
      toast({ title: "Erro na consulta", variant: "destructive" });
      throw error;
    } finally {
      setConsultando(false);
    }
  }, [toast]);

  const consultarProtocolo = useCallback(async (protocolo: string) => {
    setConsultando(true);
    try {
      return await esocialServiceReal.consultarProtocolo(protocolo);
    } finally {
      setConsultando(false);
    }
  }, []);

  const getResumo = useCallback(async (competencia: string) => {
    return esocialServiceReal.getResumoCompetencia(empresaId, competencia);
  }, [empresaId]);

  return { eventos, consultando, consultarEvento, consultarProtocolo, getResumo, refetch };
}
export default useESocialConsultaReal;
