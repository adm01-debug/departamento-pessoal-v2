import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, AlertTriangle, Clock, CheckCircle, Bell, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentoComValidade {
  id: string;
  nome: string;
  tipo: string;
  colaborador_nome?: string;
  data_emissao: string;
  data_validade: string;
  dias_para_vencer: number;
  status: "valido" | "vencendo" | "vencido" | "sem_validade";
  alerta_configurado: boolean;
  dias_alerta: number;
}

interface DocumentoValidadeProps {
  documentos: DocumentoComValidade[];
  onConfigurarAlerta?: (documentoId: string, diasAlerta: number) => Promise<void>;
  onRenovar?: (documentoId: string) => void;
  onNotificar?: (documentoId: string) => Promise<void>;
  filtroStatus?: string;
}

const statusConfig = {
  valido: { label: "Válido", color: "bg-green-500", icon: CheckCircle },
  vencendo: { label: "Vencendo", color: "bg-orange-500", icon: Clock },
  vencido: { label: "Vencido", color: "bg-red-500", icon: AlertTriangle },
  sem_validade: { label: "Sem Validade", color: "bg-gray-500", icon: Calendar }
};

export function DocumentoValidade({
  documentos,
  onConfigurarAlerta,
  onRenovar,
  onNotificar,
  filtroStatus
}: DocumentoValidadeProps) {
  const { toast } = useToast();
  const [filtro, setFiltro] = useState(filtroStatus || "todos");
  const [ordenacao, setOrdenacao] = useState<"vencimento" | "nome">("vencimento");

  const documentosFiltrados = documentos
    .filter(d => filtro === "todos" || d.status === filtro)
    .sort((a, b) => {
      if (ordenacao === "vencimento") {
        return a.dias_para_vencer - b.dias_para_vencer;
      }
      return a.nome.localeCompare(b.nome);
    });

  const resumo = {
    total: documentos.length,
    validos: documentos.filter(d => d.status === "valido").length,
    vencendo: documentos.filter(d => d.status === "vencendo").length,
    vencidos: documentos.filter(d => d.status === "vencido").length
  };

  const handleConfigurarAlerta = async (docId: string, dias: number) => {
    try {
      await onConfigurarAlerta?.(docId, dias);
      toast({ title: "Sucesso", description: `Alerta configurado para ${dias} dias antes do vencimento` });
    } catch {
      toast({ title: "Erro", description: "Falha ao configurar alerta", variant: "destructive" });
    }
  };

  const formatarData = (data: string) => new Date(data).toLocaleDateString("pt-BR");

  const getCorDias = (dias: number) => {
    if (dias < 0) return "text-red-600 font-bold";
    if (dias <= 30) return "text-orange-600 font-semibold";
    if (dias <= 60) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Calendar className="h-5 w-5" />Controle de Validade</span>
          <div className="flex gap-2">
            <Badge variant="secondary">{resumo.total} total</Badge>
            {resumo.vencidos > 0 && <Badge variant="destructive">{resumo.vencidos} vencido(s)</Badge>}
            {resumo.vencendo > 0 && <Badge className="bg-orange-500">{resumo.vencendo} vencendo</Badge>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Status</Label>
            <Select value={filtro} onValueChange={setFiltro}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="valido">Válidos</SelectItem>
                <SelectItem value="vencendo">Vencendo (30 dias)</SelectItem>
                <SelectItem value="vencido">Vencidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label>Ordenar por</Label>
            <Select value={ordenacao} onValueChange={(v) => setOrdenacao(v as "vencimento" | "nome")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="vencimento">Vencimento</SelectItem>
                <SelectItem value="nome">Nome</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total", value: resumo.total, color: "bg-blue-50 border-blue-200" },
            { label: "Válidos", value: resumo.validos, color: "bg-green-50 border-green-200" },
            { label: "Vencendo", value: resumo.vencendo, color: "bg-orange-50 border-orange-200" },
            { label: "Vencidos", value: resumo.vencidos, color: "bg-red-50 border-red-200" }
          ].map(item => (
            <div key={item.label} className={`p-3 rounded-lg border ${item.color} text-center`}>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Lista de Documentos */}
        <div className="space-y-2">
          {documentosFiltrados.map(doc => {
            const config = statusConfig[doc.status];
            const StatusIcon = config.icon;

            return (
              <div key={doc.id} className={`flex items-center justify-between p-3 border rounded-lg ${doc.status === "vencido" ? "border-red-300 bg-red-50" : doc.status === "vencendo" ? "border-orange-300 bg-orange-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-5 w-5 ${config.color.replace("bg-", "text-")}`} />
                  <div>
                    <p className="font-medium">{doc.nome}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {doc.colaborador_nome && <span>{doc.colaborador_nome}</span>}
                      <span>•</span>
                      <span>Emissão: {formatarData(doc.data_emissao)}</span>
                      <span>•</span>
                      <span>Validade: {formatarData(doc.data_validade)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={getCorDias(doc.dias_para_vencer)}>
                      {doc.dias_para_vencer < 0 
                        ? `Vencido há ${Math.abs(doc.dias_para_vencer)} dias`
                        : doc.dias_para_vencer === 0 
                          ? "Vence hoje!"
                          : `${doc.dias_para_vencer} dias restantes`
                      }
                    </p>
                    {doc.alerta_configurado && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Bell className="h-3 w-3" />Alerta em {doc.dias_alerta} dias
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onNotificar?.(doc.id)} title="Enviar notificação">
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onRenovar?.(doc.id)} title="Renovar documento">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {documentosFiltrados.length === 0 && (
          <p className="text-center text-muted-foreground py-4">Nenhum documento encontrado com os filtros selecionados</p>
        )}
      </CardContent>
    </Card>
  );
}

export default DocumentoValidade;
