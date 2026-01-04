import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, AlertTriangle, CheckCircle, XCircle, CalendarClock } from "lucide-react";
import { differenceInDays, format, parseISO, isAfter, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

type StatusValidade = "valido" | "proximo_vencer" | "vencido" | "sem_validade" | "indefinido";

interface DocumentoValidadeProps {
  dataValidade?: string | null;
  diasAlerta?: number;
  showTooltip?: boolean;
  showData?: boolean;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<StatusValidade, { icon: React.ElementType; label: string; bgColor: string; textColor: string }> = {
  valido: { icon: CheckCircle, label: "Válido", bgColor: "bg-green-100", textColor: "text-green-700" },
  proximo_vencer: { icon: AlertTriangle, label: "Próx. vencimento", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
  vencido: { icon: XCircle, label: "Vencido", bgColor: "bg-red-100", textColor: "text-red-700" },
  sem_validade: { icon: CheckCircle, label: "Sem validade", bgColor: "bg-gray-100", textColor: "text-gray-700" },
  indefinido: { icon: Clock, label: "Não informado", bgColor: "bg-slate-100", textColor: "text-slate-700" }
};

export function calcularStatusValidade(dataValidade?: string | null, diasAlerta: number = 30): { status: StatusValidade; diasRestantes: number | null } {
  if (!dataValidade) return { status: "indefinido", diasRestantes: null };
  
  const hoje = new Date();
  const validade = parseISO(dataValidade);
  const diasRestantes = differenceInDays(validade, hoje);

  if (isBefore(validade, hoje)) return { status: "vencido", diasRestantes };
  if (diasRestantes <= diasAlerta) return { status: "proximo_vencer", diasRestantes };
  return { status: "valido", diasRestantes };
}

export function DocumentoValidade({
  dataValidade,
  diasAlerta = 30,
  showTooltip = true,
  showData = false,
  size = "md"
}: DocumentoValidadeProps) {
  const { status, diasRestantes } = calcularStatusValidade(dataValidade, diasAlerta);
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-2.5 py-1.5"
  };

  const iconSizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };

  const getTooltipContent = () => {
    if (status === "indefinido") return "Data de validade não informada";
    if (status === "sem_validade") return "Documento sem prazo de validade";
    if (status === "vencido") return `Vencido há ${Math.abs(diasRestantes!)} dia(s)`;
    if (status === "proximo_vencer") return `Vence em ${diasRestantes} dia(s)`;
    return `Válido por mais ${diasRestantes} dia(s)`;
  };

  const badge = (
    <Badge className={`${config.bgColor} ${config.textColor} ${sizeClasses[size]} font-medium`}>
      <Icon className={`${iconSizes[size]} mr-1`} />
      {config.label}
      {showData && dataValidade && status !== "indefinido" && (
        <span className="ml-1 opacity-80">
          ({format(parseISO(dataValidade), "dd/MM/yyyy", { locale: ptBR })})
        </span>
      )}
    </Badge>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
          {dataValidade && status !== "indefinido" && (
            <p className="text-xs opacity-80">
              Validade: {format(parseISO(dataValidade), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function listarDocumentosProximosVencer(
  documentos: { id: string; nome: string; dataValidade?: string }[],
  diasAlerta: number = 30
): { id: string; nome: string; dataValidade: string; diasRestantes: number }[] {
  const hoje = new Date();
  const limite = addDays(hoje, diasAlerta);

  return documentos
    .filter(doc => {
      if (!doc.dataValidade) return false;
      const validade = parseISO(doc.dataValidade);
      return isAfter(validade, hoje) && isBefore(validade, limite);
    })
    .map(doc => ({
      id: doc.id,
      nome: doc.nome,
      dataValidade: doc.dataValidade!,
      diasRestantes: differenceInDays(parseISO(doc.dataValidade!), hoje)
    }))
    .sort((a, b) => a.diasRestantes - b.diasRestantes);
}

export type { StatusValidade };
export default DocumentoValidade;
