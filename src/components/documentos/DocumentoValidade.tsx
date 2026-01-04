import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarClock, AlertTriangle, Bell, CheckCircle, Clock, RefreshCw, CalendarDays } from "lucide-react";
import { format, differenceInDays, addDays, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DocumentoComValidade {
  id: string;
  nome: string;
  tipo: string;
  colaborador_nome?: string;
  data_emissao: string;
  data_validade: string;
  dias_para_vencer: number;
  status: "valido" | "vencendo" | "vencido" | "sem_validade";
  renovacao_automatica: boolean;
  lembrete_dias: number;
  notificacoes_enviadas: number;
}

interface DocumentoValidadeProps {
  documentos: DocumentoComValidade[];
  onRenovar?: (documentoId: string, novaValidade: string) => Promise<void>;
  onConfigurarLembrete?: (documentoId: string, dias: number) => Promise<void>;
  onConfigurarRenovacaoAuto?: (documentoId: string, ativo: boolean) => Promise<void>;
  diasAlertaDefault?: number;
}

const statusConfig = {
  valido: { label: "Válido", color: "bg-green-500", icon: CheckCircle },
  vencendo: { label: "Vencendo", color: "bg-orange-500", icon: Clock },
  vencido: { label: "Vencido", color: "bg-red-500", icon: AlertTriangle },
  sem_validade: { label: "Sem Validade", color: "bg-gray-500", icon: CalendarClock }
};

export function DocumentoValidade({
  documentos,
  onRenovar,
  onConfigurarLembrete,
  onConfigurarRenovacaoAuto,
  diasAlertaDefault = 30
}: DocumentoValidadeProps) {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocumentoComValidade | null>(null);
  const [novaValidade, setNovaValidade] = useState<Date | undefined>();
  const [diasLembrete, setDiasLembrete] = useState(30);

  const documentosFiltrados = documentos.filter(doc => 
    filtroStatus === "todos" || doc.status === filtroStatus
  );

  const resumo = {
    total: documentos.length,
    validos: documentos.filter(d => d.status === "valido").length,
    vencendo: documentos.filter(d => d.status === "vencendo").length,
    vencidos: documentos.filter(d => d.status === "vencido").length
  };

  const handleRenovar = async () => {
    if (!documentoSelecionado || !novaValidade) return;
    await onRenovar?.(documentoSelecionado.id, novaValidade.toISOString());
    setDocumentoSelecionado(null);
    setNovaValidade(undefined);
  };

  const handleConfigurarLembrete = async (docId: string) => {
    await onConfigurarLembrete?.(docId, diasLembrete);
  };

  const sugerirNovaValidade = (tipo: string): Date => {
    const hoje = new Date();
    switch (tipo) {
      case "aso": return addMonths(hoje, 12);
      case "cnh": return addMonths(hoje, 60);
      case "certidao": return addMonths(hoje, 3);
      default: return addMonths(hoje, 12);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Controle de Validade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">{resumo.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-2xl font-bold text-green-600">{resumo.validos}</p>
            <p className="text-sm text-green-600">Válidos</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-2xl font-bold text-orange-600">{resumo.vencendo}</p>
            <p className="text-sm text-orange-600">Vencendo</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-2xl font-bold text-red-600">{resumo.vencidos}</p>
            <p className="text-sm text-red-600">Vencidos</p>
          </div>
        </div>

        {/* Alertas */}
        {(resumo.vencidos > 0 || resumo.vencendo > 0) && (
          <div className={`p-3 rounded-lg flex items-center gap-3 ${resumo.vencidos > 0 ? "bg-red-50 border border-red-200" : "bg-orange-50 border border-orange-200"}`}>
            <AlertTriangle className={`h-5 w-5 ${resumo.vencidos > 0 ? "text-red-500" : "text-orange-500"}`} />
            <span>
              {resumo.vencidos > 0 && `${resumo.vencidos} documento(s) vencido(s). `}
              {resumo.vencendo > 0 && `${resumo.vencendo} documento(s) próximo(s) do vencimento.`}
            </span>
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2">
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filtrar por status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="valido">Válidos</SelectItem>
              <SelectItem value="vencendo">Vencendo</SelectItem>
              <SelectItem value="vencido">Vencidos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista */}
        <div className="space-y-3">
          {documentosFiltrados.map(doc => {
            const config = statusConfig[doc.status];
            const StatusIcon = config.icon;

            return (
              <div key={doc.id} className={`p-4 border rounded-lg ${doc.status === "vencido" ? "border-red-300 bg-red-50/50" : doc.status === "vencendo" ? "border-orange-300 bg-orange-50/50" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`h-5 w-5 ${config.color.replace("bg-", "text-")}`} />
                    <div>
                      <p className="font-medium">{doc.nome}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge className={config.color}>{config.label}</Badge>
                        {doc.colaborador_nome && <span>{doc.colaborador_nome}</span>}
                        <span>•</span>
                        <span>Tipo: {doc.tipo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Validade: <span className="font-medium">{format(new Date(doc.data_validade), "dd/MM/yyyy", { locale: ptBR })}</span>
                    </p>
                    {doc.status !== "sem_validade" && (
                      <p className={`text-sm ${doc.dias_para_vencer < 0 ? "text-red-500" : doc.dias_para_vencer < diasAlertaDefault ? "text-orange-500" : "text-green-500"}`}>
                        {doc.dias_para_vencer < 0 ? `Vencido há ${Math.abs(doc.dias_para_vencer)} dias` : `${doc.dias_para_vencer} dias restantes`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>Lembrete: {doc.lembrete_dias} dias antes</span>
                    </div>
                    {doc.renovacao_automatica && (
                      <Badge variant="outline" className="text-green-600"><RefreshCw className="h-3 w-3 mr-1" />Renovação Auto</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm"><Bell className="h-4 w-4 mr-2" />Lembrete</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48">
                        <div className="space-y-2">
                          <Label>Dias antes do vencimento</Label>
                          <Input type="number" value={diasLembrete} onChange={e => setDiasLembrete(parseInt(e.target.value))} />
                          <Button size="sm" className="w-full" onClick={() => handleConfigurarLembrete(doc.id)}>Salvar</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="sm"><CalendarDays className="h-4 w-4 mr-2" />Renovar</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar mode="single" selected={novaValidade} onSelect={setNovaValidade} initialFocus locale={ptBR} />
                        <div className="p-3 border-t">
                          <Button size="sm" className="w-full" onClick={() => { setDocumentoSelecionado(doc); handleRenovar(); }}>Confirmar Nova Validade</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {documentosFiltrados.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhum documento encontrado</p>
        )}
      </CardContent>
    </Card>
  );
}

export default DocumentoValidade;
