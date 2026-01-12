// V18-H001: useESocialValidacao Real
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface ValidacaoResult { valido: boolean; erros: string[]; warnings: string[]; }

export function useESocialValidacaoReal() {
  const [validando, setValidando] = useState(false);
  const [resultado, setResultado] = useState<ValidacaoResult | null>(null);
  const { toast } = useToast();

  const validarEvento = useCallback(async (tipoEvento: string, dados: Record<string, unknown>) => {
    setValidando(true);
    const erros: string[] = [];
    const warnings: string[] = [];
    
    // Validações genéricas
    if (!dados.cpfTrab && !dados.cnpj) erros.push("CPF/CNPJ obrigatório");
    if (!dados.competencia && tipoEvento.startsWith("S-12")) erros.push("Competência obrigatória");
    
    const result = { valido: erros.length === 0, erros, warnings };
    setResultado(result);
    setValidando(false);
    
    if (!result.valido) toast({ title: "Validação falhou", description: `${erros.length} erro(s)`, variant: "destructive" });
    return result;
  }, [toast]);

  const limparResultado = useCallback(() => setResultado(null), []);

  return { validando, resultado, validarEvento, limparResultado };
}
export default useESocialValidacaoReal;
