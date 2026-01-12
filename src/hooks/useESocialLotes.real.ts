// V18-H002: useESocialLotes Real
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { esocialServiceReal } from "@/services/esocialService.real";
import { useToast } from "@/hooks/use-toast";

export function useESocialLotesReal(empresaId: string) {
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState({ atual: 0, total: 0 });
  const qc = useQueryClient();
  const { toast } = useToast();

  const enviarLote = useMutation({
    mutationFn: async (eventoIds: string[]) => {
      setProcessando(true);
      setProgresso({ atual: 0, total: eventoIds.length });
      const resultado = await esocialServiceReal.enviarLote(empresaId, eventoIds);
      setProcessando(false);
      return resultado;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["esocial"] }); toast({ title: "Lote enviado!" }); },
    onError: () => { setProcessando(false); toast({ title: "Erro no envio", variant: "destructive" }); }
  });

  return { processando, progresso, enviarLote: enviarLote.mutateAsync };
}
export default useESocialLotesReal;
